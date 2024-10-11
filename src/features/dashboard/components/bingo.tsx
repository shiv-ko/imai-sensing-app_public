'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
import { generateClient } from 'aws-amplify/api';
import { updateUser } from '../../../graphql/mutations'; // 必要なミューテーションのみをインポート
import {
  UpdateUserMutationVariables,
  CreateBingoSheetInput,
  UpdateBingoSheetInput,
  BingoSheet,
} from '../../../API';
import AnimatedTitle from './animatedTitle';
import { generateBingoSheet } from '../utils/bingoGenerator'; // パスを修正
import { useRouter } from 'next/navigation'; // Next.js の useRouter を使用

Amplify.configure(awsExports);
const client = generateClient();

// カスタムクエリとミューテーションを定義
const listBingoSheetsCustom = /* GraphQL */ `
  query ListBingoSheets(
    $filter: ModelBingoSheetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBingoSheets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        isUsed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const getBingoSheetWithSquares = /* GraphQL */ `
  query GetBingoSheet($id: ID!) {
    getBingoSheet(id: $id) {
      id
      userId
      squares {
        id
        number
        categoryName
        isOpen
      }
      isUsed
      createdAt
      updatedAt
    }
  }
`;

const createBingoSheetWithSquares = /* GraphQL */ `
  mutation CreateBingoSheet($input: CreateBingoSheetInput!) {
    createBingoSheet(input: $input) {
      id
      userId
      squares {
        id
        number
        categoryName
        isOpen
      }
      isUsed
      createdAt
      updatedAt
    }
  }
`;

const updateBingoSheetWithSquares = /* GraphQL */ `
  mutation UpdateBingoSheet($input: UpdateBingoSheetInput!) {
    updateBingoSheet(input: $input) {
      id
      userId
      squares {
        id
        number
        categoryName
        isOpen
      }
      isUsed
      createdAt
      updatedAt
    }
  }
`;

// ユーザーのスコアを更新する関数
const updateUserScore = async (userId: string, newScore: number) => {
  const input: UpdateUserMutationVariables['input'] = {
    id: userId,
    score: newScore,
  };

  try {
    const result = (await client.graphql({
      query: updateUser,
      variables: { input },
    })) as { data: { updateUser: { id: string; score: number } | null } };

    console.log('User score updated:', result.data.updateUser);
    return result.data.updateUser;
  } catch (error) {
    console.error('Error updating user score:', error);
    throw new Error('ポイントの更新に失敗しました。');
  }
};

// Button コンポーネント
interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties; // 追加
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, style }) => (
  <button onClick={onClick} disabled={disabled} className="bingo-gacha-button" style={style}>
    {children}
  </button>
);

// ガチャ関連の定数と関数
const basePointValues = [1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20, 30, 50];
const baseProbabilities = [
  [0.25, 0.30, 0.20, 0.10, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00, 0.00, 0.00, 0.00],
  [0.20, 0.25, 0.20, 0.15, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00, 0.00, 0.00],
  [0.15, 0.20, 0.20, 0.15, 0.10, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00, 0.00],
  [0.10, 0.15, 0.20, 0.15, 0.12, 0.10, 0.07, 0.05, 0.03, 0.02, 0.01, 0.00, 0.00],
  [0.05, 0.10, 0.15, 0.20, 0.15, 0.12, 0.08, 0.06, 0.04, 0.03, 0.01, 0.01, 0.00],
  [0.03, 0.07, 0.12, 0.15, 0.18, 0.15, 0.10, 0.08, 0.05, 0.04, 0.02, 0.01, 0.00],
  [0.02, 0.05, 0.08, 0.12, 0.15, 0.18, 0.15, 0.10, 0.07, 0.05, 0.02, 0.01, 0.00],
  [0.01, 0.03, 0.05, 0.08, 0.12, 0.15, 0.18, 0.15, 0.10, 0.07, 0.04, 0.02, 0.00],
];

function pullGacha(completedLines: number) {
  if (completedLines < 1 || completedLines > baseProbabilities.length) {
    completedLines = 1;
  }
  const probabilities = baseProbabilities[completedLines - 1];
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  let selectedIndex = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue <= cumulativeProbability) {
      selectedIndex = i;
      break;
    }
  }

  const points = basePointValues[selectedIndex];

  return { points };
}

// 型定義
interface BingoBoardProps {
  bingoSheet: string[]; // カテゴリ名を受け取る
  openFlags: boolean[]; // 各マスの開閉状態を受け取る
}

export interface BingoBoardHandle {
  checkBingo: () => number;
  state: {
    board: { value: string; revealed: boolean }[];
  };
}

// BingoBoard コンポーネント
const BingoBoard = React.forwardRef<BingoBoardHandle, BingoBoardProps>(
  ({ bingoSheet, openFlags }, ref) => {
    const [board, setBoard] = useState(
      bingoSheet.map((category, index) => ({ value: category, revealed: openFlags[index] }))
    );

    useEffect(() => {
      setBoard(bingoSheet.map((category, index) => ({ value: category, revealed: openFlags[index] })));
      console.log('BingoBoard updated:', { bingoSheet, openFlags });
    }, [bingoSheet, openFlags]);

    const checkBingo = useCallback((newBoard: { value: string; revealed: boolean }[]) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      const bingoCount = lines.filter(line => line.every(index => newBoard[index].revealed)).length;
      console.log('Bingo count:', bingoCount);
      return bingoCount;
    }, []);

    React.useImperativeHandle(ref, () => ({
      checkBingo: () => checkBingo(board),
      state: { board },
    }));

    // Popup用の状態と関数
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showPostPopup, setShowPostPopup] = useState(false);
    const router = useRouter();

    const handleCellClick = (category: string) => {
      console.log(`Cell clicked: ${category}`);
      if (category !== '?') {
        setSelectedCategory(category);
        setShowPostPopup(true);
      }
    };

    const handlePost = () => {
      console.log('Post button clicked');
      setShowPostPopup(false);
      router.push('/camera'); // '/post' を '/camera' に変更
    };

    return (
      <>
        <div className="bingo-gacha-board">
          {board.map((cell, index) => (
            <motion.div
              key={index}
              className={`bingo-gacha-board-cell ${cell.revealed ? 'revealed' : ''}`}
              onClick={() => handleCellClick(cell.value)}
              animate={{
                scale: cell.revealed ? [1, 1.05, 1] : 1,
                backgroundColor: cell.revealed ? ['#fbbf24', '#f6ad55', '#f6ad55'] : '#e0e0e0',
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            >
              {cell.value}
              {cell.revealed && (
                <div className="stamp-circle"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* お題投稿のポップアップ */}
        <AnimatePresence>
          {showPostPopup && selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bingo-gacha-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bingo-gacha-popup"
              >
                <h2>お題の投稿</h2>
                <p>カテゴリ: <strong>{selectedCategory}</strong></p>
                <div className="bingo-gacha-button-container">
                  <Button onClick={handlePost} disabled={false}>
                    投稿する
                  </Button>
                  <Button onClick={() => setShowPostPopup(false)} disabled={false} style={{ marginLeft: '1rem' }}>
                    キャンセル
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

BingoBoard.displayName = 'BingoBoard';

// BingoGachaPopup コンポーネント
const BingoGachaPopup: React.FC<{ onClose: () => void; completedLines: number; addPoints: (points: number) => void }> = ({ onClose, completedLines, addPoints }) => {
  const [result, setResult] = useState<{ points: number } | null>(null);
  const [stage, setStage] = useState<'idle' | 'result'>('idle');
  const confettiCanvasRef = useRef<HTMLDivElement>(null);

  const handlePullGacha = useCallback(() => {
    console.log('Gacha pulled with completed lines:', completedLines);
    const newResult = pullGacha(completedLines);
    console.log('Gacha result:', newResult);
    setResult(newResult);
    addPoints(newResult.points);
    setStage('result');

    // Confettiの表示
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    if (confettiCanvasRef.current) {
      confettiCanvasRef.current.appendChild(canvas);
    }

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      canvas.remove();
      console.log('Confetti animation ended and canvas removed.');
    }, 3000);
  }, [completedLines, addPoints]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bingo-gacha-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bingo-gacha-popup"
        ref={confettiCanvasRef}
      >
        <h2>ビンゴガチャ</h2>
        <p className="result-text">
          完成したライン数: {completedLines}
        </p>
        <div className="bingo-gacha-content">
          <AnimatePresence mode="wait">
            {stage === 'result' && result && (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: 180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -180, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="bingo-gacha-result-circle"
              >
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  {result.points} ポイント
                </motion.h2>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.7, type: "spring" }}
                  className="bingo-gacha-trophy"
                >
                  🏆
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bingo-gacha-button-container">
          <Button
            onClick={stage === 'idle' ? handlePullGacha : onClose}
            disabled={false}
          >
            {stage === 'idle' ? 'ガチャを回す' : '閉じる'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Bingo コンポーネント
interface BingoProps {
  userId: string;
  initialScore: number;
}

export function Bingo({ userId, initialScore }: BingoProps) {
  const [showGachaButton, setShowGachaButton] = useState(false);
  const [showGachaPopup, setShowGachaPopup] = useState(false);
  const [bingoKey, setBingoKey] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);
  const [totalPoints, setTotalPoints] = useState(initialScore);
  const boardRef = useRef<BingoBoardHandle | null>(null);
  const [bingoSheet, setBingoSheet] = useState<string[]>(Array(9).fill('?'));
  const [openFlags, setOpenFlags] = useState<boolean[]>(Array(9).fill(false));

  useEffect(() => {
    setTotalPoints(initialScore);
    console.log('Initial score set to:', initialScore);
  }, [initialScore]);

  const addPoints = useCallback(
    async (points: number) => {
      const newScore = totalPoints + points;
      setTotalPoints(newScore);
      console.log(`Adding ${points} points. New total: ${newScore}`);

      try {
        const updatedUser = await updateUserScore(userId, newScore);
        console.log('User score updated successfully:', updatedUser);
      } catch (error) {
        console.error('Failed to update score:', error);
      }
    },
    [totalPoints, userId]
  );

  const handleBingoComplete = useCallback((lines: number) => {
    console.log('Bingo completed with lines:', lines);
    setCompletedLines(lines);
    setShowGachaButton(true);
  }, []);

  const handleOpenGacha = useCallback(() => {
    if (boardRef.current && boardRef.current.checkBingo) {
      const recalculatedLines = boardRef.current.checkBingo();
      console.log('Recalculated completed lines:', recalculatedLines);
      setCompletedLines(recalculatedLines);
    }
    setShowGachaPopup(true);
    console.log('Gacha popup opened.');
  }, []);

  // 既存のビンゴシートを使用済みに更新する関数
  const markBingoSheetAsUsed = useCallback(async () => {
    console.log('Marking bingo sheet as used.');
    try {
      const listResult = (await client.graphql({
        query: listBingoSheetsCustom,
        variables: { filter: { userId: { eq: userId }, isUsed: { eq: false } }, limit: 1 },
      })) as { data: { listBingoSheets: { items: BingoSheet[] } } };

      if (
        listResult.data.listBingoSheets &&
        Array.isArray(listResult.data.listBingoSheets.items) &&
        listResult.data.listBingoSheets.items.length > 0
      ) {
        const existingSheetSummary = listResult.data.listBingoSheets.items[0];

        const updateInput: UpdateBingoSheetInput = {
          id: existingSheetSummary.id,
          isUsed: true,
        };

        console.log('Updating bingo sheet isUsed to true:', updateInput);

        await client.graphql({
          query: updateBingoSheetWithSquares,
          variables: { input: updateInput },
        });
        console.log('Bingo sheet marked as used successfully.');
      }
    } catch (error) {
      console.error('Error marking bingo sheet as used:', error);
    }
  }, [userId]);

  const handleCloseGacha = useCallback(async () => {
    console.log('Gacha popup closed.');
    setShowGachaPopup(false);
    setShowGachaButton(false);
    setBingoKey(prevKey => prevKey + 1);
    setCompletedLines(0);
    setBingoSheet(Array(9).fill('?'));
    setOpenFlags(Array(9).fill(false));

    // 既存のビンゴシートを使用済みに更新
    await markBingoSheetAsUsed();
  }, [markBingoSheetAsUsed]);

  // ビンゴ生成ボタンのハンドラー
  const handleGenerateBingo = useCallback(async () => {
    console.log('Generating new bingo sheet.');
    const newSheet = generateBingoSheet();
    console.log('Generated bingo sheet:', newSheet);
    setBingoSheet(newSheet);
    setOpenFlags(Array(9).fill(false)); // 新しいビンゴシート生成時にフラグをリセット
    setBingoKey(prevKey => prevKey + 1); // BingoBoardを再レンダリング
    setShowGachaButton(false);
    setCompletedLines(0);

    // ビンゴシートを AWS に保存
    await saveBingoSheet(newSheet, Array(9).fill(false));
  }, []);

  // ビンゴシートを保存する関数
  const saveBingoSheet = useCallback(
    async (sheet: string[], flags: boolean[]) => {
      console.log('Saving bingo sheet:', { sheet, flags });
      try {
        // 未使用のビンゴシートを取得
        const listResult = (await client.graphql({
          query: listBingoSheetsCustom,
          variables: { filter: { userId: { eq: userId }, isUsed: { eq: false } }, limit: 1 },
        })) as { data: { listBingoSheets: { items: BingoSheet[] } } };

        console.log('Fetched bingo sheets:', listResult.data.listBingoSheets);

        if (
          listResult.data.listBingoSheets &&
          Array.isArray(listResult.data.listBingoSheets.items) &&
          listResult.data.listBingoSheets.items.length > 0
        ) {
          // 既存のビンゴシートを更新するために getBingoSheet クエリを実行
          const existingSheetSummary = listResult.data.listBingoSheets.items[0];
          console.log('Existing bingo sheet summary:', existingSheetSummary);

          const getResult = (await client.graphql({
            query: getBingoSheetWithSquares,
            variables: { id: existingSheetSummary.id },
          })) as { data: { getBingoSheet: BingoSheet } };

          console.log('Fetched detailed bingo sheet:', getResult.data.getBingoSheet);

          const existingSheet = getResult.data.getBingoSheet;
          if (!existingSheet || !existingSheet.squares) {
            console.error('Detailed bingo sheet or squares are undefined.');
            return;
          }

          const updatedSheetInput: UpdateBingoSheetInput = {
            id: existingSheet.id,
            userId: userId,
            squares: sheet.map((category, index) => ({
              id: existingSheet.squares[index]?.id || `square-${index}`,
              number: index + 1,
              categoryName: category,
              isOpen: flags[index],
            })),
            isUsed: existingSheet.isUsed,
          };

          console.log('Updating existing bingo sheet:', updatedSheetInput);

          await client.graphql({
            query: updateBingoSheetWithSquares,
            variables: { input: updatedSheetInput },
          });
          console.log('Bingo sheet updated successfully.');
        } else {
          // 新しいビンゴシートを作成
          const newSheetInput: CreateBingoSheetInput = {
            userId: userId,
            squares: sheet.map((category, index) => ({
              id: `square-${index}`,
              number: index + 1,
              categoryName: category,
              isOpen: flags[index],
            })),
            isUsed: false,
          };

          console.log('Creating new bingo sheet:', newSheetInput);

          await client.graphql({
            query: createBingoSheetWithSquares,
            variables: { input: newSheetInput },
          });
          console.log('Bingo sheet created successfully.');
        }
      } catch (error) {
        console.error('Error saving bingo sheet:', error);
      }
    },
    [userId]
  );

  // コンポーネントのマウント時にビンゴシートをロード
  useEffect(() => {
    const loadBingoSheet = async () => {
      console.log('Loading bingo sheet for user:', userId);
      try {
        const listResult = (await client.graphql({
          query: listBingoSheetsCustom,
          variables: { filter: { userId: { eq: userId }, isUsed: { eq: false } }, limit: 1 },
        })) as { data: { listBingoSheets: { items: BingoSheet[] } } };

        console.log('Fetched bingo sheets on load:', listResult.data.listBingoSheets);

        if (
          listResult.data.listBingoSheets &&
          Array.isArray(listResult.data.listBingoSheets.items) &&
          listResult.data.listBingoSheets.items.length > 0
        ) {
          const existingSheetSummary = listResult.data.listBingoSheets.items[0];
          console.log('Existing bingo sheet summary:', existingSheetSummary);

          // getBingoSheet クエリを実行して詳細を取得
          const getResult = (await client.graphql({
            query: getBingoSheetWithSquares,
            variables: { id: existingSheetSummary.id },
          })) as { data: { getBingoSheet: BingoSheet } };

          console.log('Fetched detailed bingo sheet:', getResult.data.getBingoSheet);

          const existingSheet = getResult.data.getBingoSheet;
          if (!existingSheet || !existingSheet.squares) {
            console.error('Detailed bingo sheet or squares are undefined.');
            return;
          }

          const categories = existingSheet.squares.map(square => square?.categoryName || '?');
          const flags = existingSheet.squares.map(square => square?.isOpen || false);
          setBingoSheet(categories);
          setOpenFlags(flags);
          setBingoKey(prevKey => prevKey + 1); // BingoBoardを再レンダリング
          console.log('Loaded existing bingo sheet:', { categories, flags });

          // 既存のビンゴシートがロードされた後にビンゴ判定を行う
          if (existingSheet && existingSheet.squares) {
            const newFlags = existingSheet.squares.map(square => square?.isOpen || false);
            setOpenFlags(newFlags);
            const lines = [
              [0, 1, 2],
              [3, 4, 5],
              [6, 7, 8],
              [0, 3, 6],
              [1, 4, 7],
              [2, 5, 8],
              [0, 4, 8],
              [2, 4, 6],
            ];
            const completed = lines.filter(line => line.every(index => newFlags[index])).length;
            if (completed > 0) {
              handleBingoComplete(completed); // ビンゴが完成している場合
            }
          }
        } else {
          console.log('No existing bingo sheet found.');
          // 必要に応じて新しいシートを自動生成する処理を追加
        }
      } catch (error) {
        console.error('Error loading bingo sheet:', error);
      }
    };

    loadBingoSheet();
  }, [userId]);

  // お題の投稿があった際にビンゴシートのフラグを更新する関数
  const handleNewPost = useCallback(
    async (category: string) => {
      console.log(`New post received for category: ${category}`);
      const newOpenFlags = bingoSheet.map((sheetCategory, index) =>
        sheetCategory === category ? true : openFlags[index]
      );
      console.log('Updated open flags:', newOpenFlags);
      setOpenFlags(newOpenFlags);

      // ビンゴのチェック
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      const completed = lines.filter(line => line.every(index => newOpenFlags[index])).length;
      console.log('Completed lines after new post:', completed);

      if (completed > 0) {
        handleBingoComplete(completed);
      }

      // ビンゴシートを AWS に保存
      await saveBingoSheet(bingoSheet, newOpenFlags);
    },
    [bingoSheet, openFlags, handleBingoComplete, saveBingoSheet]
  );

  return (
    <div className="bingo-gacha-game">
      <style jsx global>{`
        .bingo-gacha-game {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background-color: #f9f9f9;
          min-height: 100vh;
        }
        .bingo-title {
          margin-bottom: 1rem;
        }
        .total-points {
          font-size: 1.5rem;
          color: #4a4a4a;
          margin-bottom: 2rem;
          text-align: center;
        }
        .bingo-gacha-button {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          background: linear-gradient(to right, #fbbf24, #f6ad55);
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 9999px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }
        .bingo-gacha-button:hover {
          transform: scale(1.05);
          background: linear-gradient(to right, #f6ad55, #fbbf24);
        }
        .bingo-gacha-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bingo-gacha-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background-color: #ffffff;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #fbbf24;
        }
        .bingo-gacha-board-cell {
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          border: 1px solid #fbbf24;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          color: #4a4a4a;
          transition: background-color 0.3s, transform 0.3s;
          text-align: center;
          padding: 0.5rem;
          position: relative;
        }
        .bingo-gacha-board-cell.revealed {
          background-color: #fbbf24;
          transform: scale(1.05);
          color: #ffffff;
        }
        .stamp-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3rem;
          height: 3rem;
          border: 4px solid #ff0000;
          border-radius: 50%;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          animation: stamp-appear 0.5s ease-out forwards;
        }
        @keyframes stamp-appear {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          80% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        .bingo-gacha-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .bingo-gacha-popup {
          background-color: #ffffff;
          border-radius: 0.5rem;
          padding: 1rem;
          max-width: 28rem;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: center;
        }
        .bingo-gacha-content {
          width: 100%;
          height: 24rem;
          background-color: #f3f4f6;
          border-radius: 0.75rem;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          overflow: hidden;
          position: relative;
        }
        .bingo-gacha-result-circle {
          width: 16rem;
          height: 16rem;
          border-radius: 9999px;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          z-index: 30;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .bingo-gacha-result-circle h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #4a4a4a;
        }
        .bingo-gacha-trophy {
          font-size: 4rem;
          margin-top: 1rem;
        }
        .result-text {
          margin: 0.5rem 0;
          font-size: 1.25rem;
          color: #4a4a4a;
        }
        .bingo-gacha-button-container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .bingo-gacha-bold {
          font-weight: bold;
        }
        .bingo-gacha-container {
          margin-bottom: 2rem;
        }
      `}</style>

      {/* タイトルの追加 */}
      <div className="bingo-title">
        <AnimatedTitle />
      </div>
      <div className="total-points">総ポイント: {totalPoints}</div>

      <div className="bingo-gacha-container">
        <BingoBoard
          key={bingoKey}
          ref={boardRef}
          bingoSheet={bingoSheet}
          openFlags={openFlags} // フラグを渡す
        />
      </div>

      {/* ビンゴ生成ボタンの追加 */}
      <Button onClick={handleGenerateBingo} disabled={false}>
        ビンゴを生成
      </Button>

      {/* お題の投稿をシミュレートするボタン */}
      <div style={{ marginTop: '1rem' }}>
        <h3>お題の投稿をシミュレート</h3>
        {['Technology', 'Nature', 'Science', 'Art', 'テスト'].map(category => (
          <Button
            key={category}
            onClick={() => handleNewPost(category)}
            disabled={false}
          >
            {category} のお題を投稿
          </Button>
        ))}
      </div>

      {showGachaButton && (
        <Button onClick={handleOpenGacha} disabled={false}>
          ガチャを表示
        </Button>
      )}
      <AnimatePresence>
        {showGachaPopup && (
          <BingoGachaPopup onClose={handleCloseGacha} completedLines={completedLines} addPoints={addPoints} />
        )}
      </AnimatePresence>
    </div>
  );
}
