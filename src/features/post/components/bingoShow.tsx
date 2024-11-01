// src/features/dashboard/components/BingoUI.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { pullGacha } from '@/features/dashboard/utils/bingoUtils';
import { 
  BingoBoardHandle, 
  BingoProps, 
  ButtonProps, 
  BingoGachaPopupProps, 
  BingoBoardProps 
} from '@/features/dashboard/utils/bingoTypes';
import {fetchBingoSheet, markCategoryAsCompleted, fetchPosts } from '@/features/dashboard/utils/awsService'; 
import { usePost } from '@/shared/contexts/PostContext';


// Button コンポーネント
export const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="bingo-gacha-button">
    {children}
  </button>
);

// BingoBoard コンポーネント
export const BingoBoard = forwardRef<BingoBoardHandle, BingoBoardProps>(
  ({ bingoSheet }, ref) => {
    const { setSelectedCategory } = usePost();

    const [board, setBoard] = useState(
      bingoSheet.map(cell => ({ ...cell }))
    );

    useEffect(() => {
      setBoard(bingoSheet.map(cell => ({ ...cell })));
    }, [bingoSheet]);

    const checkBingo = useCallback((newBoard: { category: string; isCompleted: boolean }[]) => {
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

      return lines.filter(line => line.every(index => newBoard[index].isCompleted)).length;
    }, []);

    useImperativeHandle(ref, () => ({
      checkBingo: () => checkBingo(board),
      state: { board },
    }));

    const handleCellClick = (category: string) => {
      setSelectedCategory(category);
    };

    return (
      <div className="bingo-gacha-board">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            className={`bingo-gacha-board-cell ${cell.isCompleted ? 'completed' : 'incomplete'}`}
            animate={{
              backgroundColor: cell.isCompleted ? '#fbbf24' : '#e0e0e0',
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            onClick={() => handleCellClick(cell.category)}
            style={{ cursor: 'pointer' }}
          >
            <span className="category-text">{cell.category}</span>
            {cell.isCompleted && (
              <motion.div
                className="completion-overlay"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    );
  }
);

BingoBoard.displayName = 'BingoBoard';

// BingoGachaPopup コンポーネントの props に handleGenerateBingo を追加
export const BingoGachaPopup: React.FC<BingoGachaPopupProps & { handleGenerateBingo: () => Promise<void> }> = ({ onClose, completedLines, addPoints, handleGenerateBingo }) => {
  const [result, setResult] = useState<{ points: number } | null>(null);
  const [stage, setStage] = useState<'idle' | 'result'>('idle');
  const confettiCanvasRef = useRef<HTMLDivElement>(null);
  const [isAddingPoints, setIsAddingPoints] = useState<boolean>(false);

  const handlePullGacha = useCallback(async () => {
    if (isAddingPoints) return;
    setIsAddingPoints(true);

    const newResult = pullGacha(completedLines);
    setResult(newResult);
    
    try {
      await addPoints(newResult.points);
      setStage('result');
      
      // 新しいビンゴシートを生成
      await handleGenerateBingo();
      
    } catch (error) {
      console.error('ポイント追加またはビンゴシート生成中にエラーが発生しした:', error);
    } finally {
      setIsAddingPoints(false);
    }

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
  }, [completedLines, addPoints, isAddingPoints, handleGenerateBingo]);

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
        <div className="bingo-gacha-button-container popup-buttons">
          <Button
            onClick={stage === 'idle' ? handlePullGacha : onClose}
            disabled={isAddingPoints}
          >
            {stage === 'idle' ? (isAddingPoints ? '処理中...' : 'ガチャを回す') : '閉じる'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Bingo コンポーネント
export const Bingo: React.FC<BingoProps> = ({ userId }) => {
  const [bingoSheet, setBingoSheet] = useState<{ category: string; isCompleted: boolean }[]>([]);
  const [currentSheetId, setCurrentSheetId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const boardRef = useRef<BingoBoardHandle | null>(null);
  const [bingoSheetExists, setBingoSheetExists] = useState(false);

  const checkBingoLines = useCallback((sheet: { category: string; isCompleted: boolean }[]): number => {
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
    return lines.filter(line => line.every(index => sheet[index].isCompleted)).length;
  }, []);



  const loadBingoSheet = useCallback(async () => {
    try {
      const sheet = await fetchBingoSheet(userId);
      if (sheet && sheet.cells && sheet.cells.length > 0) {
        setBingoSheet(sheet.cells);
        setCurrentSheetId(sheet.id);
        setBingoSheetExists(true);
        console.log('ビンゴシートをロードしました。セル数:', sheet.cells.length);
        return sheet;
      } else {
        console.log('保存されたビンゴシートが存在しません。');
        setBingoSheetExists(false);
        return null;
      }
    } catch (error) {
      console.error('ビンゴシートの取得に失敗しました:', error);
      setBingoSheetExists(false);
      return null;
    }
  }, [userId]);

  const loadPostsAndUpdateBingoSheet = useCallback(async (sheetCreatedAt: Date) => {
    console.log('loadPostsAndUpdateBingoSheet が呼び出されました');
    console.log('ビンゴシートの作成日時:', sheetCreatedAt);
    try {
      console.log('投稿データを取得中...');
      const startDateString = sheetCreatedAt.toISOString();
      console.log('startDateString:', startDateString);
      const fetchPostsResult = await fetchPosts(
        'POST',
        'すべて',
        null,
        1000,
        startDateString,
        undefined,
        userId
      );
      console.log('fetchPosts の結果:', fetchPostsResult);
      const { posts } = fetchPostsResult;
      console.log('取得した投稿データ:', posts);
      if (posts.length === 0) {
        console.log('投稿データはありません。');
        return;
      }
      const categoriesWithDates: { category: string; createdAt: Date }[] = posts.map(post => ({
        category: post.category,
        createdAt: new Date((post as any).createdAt)
      }));
      categoriesWithDates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      console.log('カテゴリと作成日時のペア:', categoriesWithDates);
      const filteredCategories = categoriesWithDates
        .filter(post => post.createdAt > sheetCreatedAt)
        .map(post => post.category);
      console.log('フィルタリングされたカテゴリ:', filteredCategories);
      if (bingoSheet.length > 0) {
        let updatedSheet = [...bingoSheet];
        const updatedCategories: string[] = [];
        updatedSheet = updatedSheet.map(cell => {
          if (!cell.isCompleted && filteredCategories.includes(cell.category)) {
            console.log(`カテゴリ "${cell.category}" を完了しました。`);
            updatedCategories.push(cell.category);
            return { ...cell, isCompleted: true, completedAt: new Date() };
          }
          return cell;
        });
        if (updatedCategories.length > 0) {
          console.log('ビンゴシートの更新前:', bingoSheet);
          console.log('ビンゴシートの更新後:', updatedSheet);
          setBingoSheet(updatedSheet);
          const completed = checkBingoLines(updatedSheet);
          if (completed > 0) {
            console.log(`ビンゴラインが${completed}本完成しました。`);
          }
          for (const category of updatedCategories) {
            if (currentSheetId) {
              try {
                await markCategoryAsCompleted(currentSheetId, category);
                console.log(`バックエンドのビンゴシートも更新しました: カテゴリ "${category}" を完了しました。`);
              } catch (error) {
                console.error(`カテゴリ "${category}" の更新に失敗しました:`, error);
              }
            } else {
              console.error('現在のビンゴシートIDがnullです。更新できません。');
            }
          }
        } else {
          console.log('ビンゴシートの更新は必要ありませんでした。');
        }
      }
    } catch (error) {
      console.error('投稿データの取得に失敗しました:', error);
    }
  }, [userId, bingoSheet, checkBingoLines, currentSheetId]);

  useEffect(() => {
    const initializeBingoAndPosts = async () => {
      if (isInitialized) return;
      const sheet = await loadBingoSheet();
      console.log('ビンゴシートのロード完了');
      if (sheet && sheet.createdAt) {
        const createdAt = new Date(sheet.createdAt);
        console.log('ビンゴシートの作成日時:', createdAt);
        await loadPostsAndUpdateBingoSheet(createdAt);
      } else {
        console.log('ビンゴシートの作成日時が設定されていません。');
      }
      setIsInitialized(true);
    };
    initializeBingoAndPosts();
  }, [isInitialized, loadBingoSheet, loadPostsAndUpdateBingoSheet]);


  return (
    <div className="bingo-gacha-game">
      <style jsx global>{`
        .bingo-gacha-game {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background-color: #f5f5f5;
          height: 100%; // min-heightをheightに変更
          overflow: hidden; // オーバーフローを防ぐ
        }
        .bingo-title {
          justify-content: center;
          margin-left: 1rem;
        }
        .bingo-gacha-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
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
          background-color: '#f5f5f5'; // #ffffffから#f5f5f5に変更
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #fbbf24;
          width: 100%;
          max-width: 500px;
        }
        .bingo-gacha-board-cell {
          position: relative; /* オーバーレイを正しく配置するためにrelativeを追加 */
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          border: 1px solid #fbbf24;
          border-radius: 0.5rem;
          cursor: pointer; /* クリックできないようにカーソルを変更 */
          font-size: 0.9rem; /* フォントサイズを調整 */
          font-weight: bold;
          color: #4a4a4a;
          text-align: center; /* テキストを中央揃え */
          padding: 0; /* パディングを削除 */
          transition: transform 0.2s ease; /* ホバーエフェクトのトランジション */
        }

        .bingo-gacha-board-cell:hover {
          transform: scale(1.05); /* ホバー時に少し拡大 */
        }

        .bingo-gacha-board-cell.completed {
          background-color: #fbbf24;
          color: #ffffff;
        }
        .bingo-gacha-board-cell.incomplete {
          background-color: #e0e0e0;
          color: #4a4a4a;
        }
        /* チェックマークのスタイルを削除 */
        /* .completion-stamp {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 15px;
          height: 15px;
          background-color: red;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        } */
        .completion-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 4px solid red;
          border-radius: 50%;
          pointer-events: none;
          box-sizing: border-box;
        }
        .category-text {
          word-wrap: break-word;
          padding: 0.5rem; /* テキストのパディングを追加 */
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
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
          padding: 1.5rem;
          max-width: 28rem;
          width: 90%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: center;
        }
        .bingo-gacha-content {
          width: 100%;
          height: 24rem;
          background-color: '#f5f5f5'; // #ffffffから#f5f5f5に変更
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
          background-color: '#f5f5f5'; // #ffffffから#f5f5f5に変更
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
          gap: 2rem; /* ボタン間のスペースを2remに増加 */
          flex-wrap: wrap; /* ボタが小さい画面でも折り返す */
        }
        .bingo-gacha-button-container.popup-buttons {
          justify-content: center;
        }
        .bingo-gacha-bold {
          font-weight: bold;
        }
        /* 投稿フォームのスタイルを削除 */
        .post-category-form {
          display: none;
        }
        /* ビンゴを表示ボタンとビンゴシートの間隔を広げる */
        .bingo-gacha-container {
          margin-top:1rem; 
        }
        /* スポンシブ対応 */
        @media (max-width: 600px) {
          .bingo-gacha-board {
            grid-template-columns: repeat(3, 1fr);
            max-width: 100%;
          }
          .bingo-gacha-popup {
            padding: 1rem;
          }
          .bingo-gacha-result-circle {
            width: 12rem;
            height: 12rem;
          }
        }
        .ranking-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }
      `}</style>


      {/* ビンゴボードの表示 */}
      {bingoSheetExists && bingoSheet.length > 0 && (
        <div className="bingo-gacha-container">
          <BingoBoard 
            bingoSheet={bingoSheet}
            ref={boardRef} 
          />
        </div>
      )}

    </div>
  );
};







