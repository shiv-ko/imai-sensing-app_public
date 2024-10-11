'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
import { generateClient } from 'aws-amplify/api';
import { updateUser } from '../../../graphql/mutations';
import { UpdateUserMutationVariables } from '../../../API';
import AnimatedTitle from './animatedTitle';
import { generateBingoSheet } from '../utils/bingoGenerator'; // パスを修正
import { useRouter } from 'next/navigation'; // Next.js の useRouter を使用

Amplify.configure(awsExports);
const client = generateClient();

// ユーザーのスコアを更新する関数
const updateUserScore = async (userId: string, newScore: number) => {
  const input: UpdateUserMutationVariables['input'] = {
    id: userId,
    score: newScore,
  };

  try {
    const result = await client.graphql({
      query: updateUser,
      variables: { input },
    });
    console.log('User score updated:', result.data?.updateUser);
    return result.data?.updateUser || null;
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
  [0.01, 0.03, 0.05, 0.08, 0.12, 0.15, 0.18, 0.15, 0.10, 0.07, 0.04, 0.02, 0.00]
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

      return lines.filter(line => line.every(index => newBoard[index].revealed)).length;
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
      if (category !== '?') {
        setSelectedCategory(category);
        setShowPostPopup(true);
      }
    };

    const handlePost = () => {
      setShowPostPopup(false);
      router.push('/camera'); // '/post' を '/camera' に変更

      // セルに⭕️を追加するロジックは既に openFlags が更新されているため、
      // CSSでスタンプ風の円形が表示されます。
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

BingoBoard.displayName = 'BingoBoard';  // この行を追加

// BingoGachaPopup コンポーネント
const BingoGachaPopup: React.FC<{ onClose: () => void; completedLines: number; addPoints: (points: number) => void }> = ({ onClose, completedLines, addPoints }) => {
  const [result, setResult] = useState<{ points: number } | null>(null);
  const [stage, setStage] = useState<'idle' | 'result'>('idle');
  const confettiCanvasRef = useRef<HTMLDivElement>(null);

  const handlePullGacha = useCallback(() => {
    const newResult = pullGacha(completedLines);
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
      useWorker: true
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      canvas.remove();
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
  }, [initialScore]);

  const addPoints = useCallback(
    async (points: number) => {
      const newScore = totalPoints + points;
      setTotalPoints(newScore);

      try {
        await updateUserScore(userId, newScore);
        console.log('User score updated successfully:', newScore);
      } catch (error) {
        console.error('Failed to update score:', error);
      }
    },
    [totalPoints, userId]
  );

  const handleBingoComplete = useCallback((lines: number) => {
    setCompletedLines(lines);
    setShowGachaButton(true);
  }, []);

  const handleOpenGacha = useCallback(() => {
    if (boardRef.current && boardRef.current.checkBingo) {
      const recalculatedLines = boardRef.current.checkBingo();
      setCompletedLines(recalculatedLines);
    }
    setShowGachaPopup(true);
  }, []);

  const handleCloseGacha = useCallback(() => {
    setShowGachaPopup(false);
    setShowGachaButton(false);
    setBingoKey(prevKey => prevKey + 1);
    setCompletedLines(0);
    setBingoSheet(Array(9).fill('?'));
    setOpenFlags(Array(9).fill(false));
  }, []);

  // ビンゴ生成ボタンのハンドラー
  const handleGenerateBingo = useCallback(() => {
    const newSheet = generateBingoSheet();
    setBingoSheet(newSheet);
    setOpenFlags(Array(9).fill(false)); // 新しいビンゴシート生成時にフラグをリセット
    setBingoKey(prevKey => prevKey + 1); // BingoBoardを再レンダリング
    setShowGachaButton(false);
    setCompletedLines(0);
  }, []);

  // お題の投稿があった際にビンゴシートのフラグを更新する関数
  const handleNewPost = useCallback((category: string) => {
    const newOpenFlags = bingoSheet.map((sheetCategory, index) =>
      sheetCategory === category ? true : openFlags[index]
    );
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

    if (completed > 0) {
      handleBingoComplete(completed);
    }
  }, [bingoSheet, openFlags, handleBingoComplete]);

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
          cursor: pointer; /* クリック可能に */
          font-size: 1rem; /* カテゴリ名表示用にフォントサイズを調整 */
          font-weight: bold;
          color: #4a4a4a;
          transition: background-color 0.3s, transform 0.3s;
          text-align: center; /* テキストを中央揃え */
          padding: 0.5rem; /* パディングを追加 */
          position: relative; /* スタンプを配置するために相対位置を設定 */
        }
        .bingo-gacha-board-cell.revealed {
          background-color: #fbbf24;
          transform: scale(1.05);
          color: #ffffff;
        }
        /* スタンプ風の円形のスタイル */
        .stamp-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3rem; /* 大きさを調整 */
          height: 3rem;
          border: 4px solid #ff0000; /* 赤い外枠 */
          border-radius: 50%;
          background-color: transparent; /* 背景を透明に */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); /* 影を追加してスタンプ感を強調 */
          animation: stamp-appear 0.5s ease-out forwards;
        }
        /* スタンプが現れるアニメーション */
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
