// src/features/dashboard/components/BingoUI.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AnimatedTitle from './animatedTitle';
import { pullGacha, generateBingoSheet } from '../utils/bingoUtils';
import { 
  BingoBoardHandle, 
  BingoProps, 
  ButtonProps, 
  BingoGachaPopupProps, 
  BingoBoardProps 
} from '../utils/bingoTypes';
import { addPointsToUser, createNewBingoSheet, fetchBingoSheet, markCategoryAsCompleted, fetchPosts } from '../utils/awsService'; 
import { CreateBingoSheetMutationVariables } from '../../../API'; // 正しくインポート

import UserRanking from '@/shared/components/ranking';
import { useRouter } from 'next/navigation'; // 追加
import { usePost } from '@/shared/contexts/PostContext'; // 追加

// Button コンポーネント
export const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="bingo-gacha-button">
    {children}
  </button>
);

// BingoBoard コンポーネント
export const BingoBoard = forwardRef<BingoBoardHandle, BingoBoardProps>(
  ({ bingoSheet }, ref) => {
    const router = useRouter();
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

      const completedLines = lines.filter(line => line.every(index => newBoard[index].isCompleted));
      
      return completedLines.length;
    }, []);

    useImperativeHandle(ref, () => ({
      checkBingo: () => {
        const result = checkBingo(board);
        return result;
      },
      state: { board },
    }));

    const handleCellClick = (category: string) => {
      setSelectedCategory(category);
      router.push('/camera');
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
  const [stage, setStage] = useState<'idle' | 'spinning' | 'result'>('idle');
  const confettiCanvasRef = useRef<HTMLDivElement>(null);
  const [isAddingPoints, setIsAddingPoints] = useState<boolean>(false);
  const [rotation, setRotation] = useState(0);
  const [showBall, setShowBall] = useState(false);
  const [ballColor, setBallColor] = useState<string>('#ffffff'); // ボールの色を状態として管理
  const [isAnimating, setIsAnimating] = useState<boolean>(false); // アニメーション状態を管理

  const getBallColor = (points: number): string => {
    if (points < 2) return '#ffffff'; // 白
    if (points < 4) return '#00bfff'; // 青 (deepskyblue)
    if (points < 6) return '#ffd700'; // 黄色 (gold)
    if (points < 8) return '#32cd32'; // 緑 (limegreen)
    if (points < 10) return '#9370db'; // 紫 (mediumpurple)
    if (points < 16) return '#ff0000'; // 赤
    return 'linear-gradient(145deg, #ff0000, #ff7f00, #ffff00, #00ff00, #00ffff, #0000ff, #800080)'; // 虹色
  };

  const handlePullGacha = useCallback(async () => {
    if (isAddingPoints) return;
    setIsAddingPoints(true);
    setIsAnimating(true); // アニメーション開始
    setStage('spinning');
    setShowBall(false);

    const newResult = await pullGacha(completedLines);
    // ボールの色を決定
    const color = getBallColor(newResult.points); // newResultからポイントを取得
    setBallColor(color); // 状態を更新
    const gachaBall = document.querySelector('.gacha-ball') as HTMLElement; // HTMLElementにキャスト
    if (gachaBall) {
      gachaBall.style.background = color; // ボールの色を設定
    }

    let currentRotation = 0;
    const spinInterval = setInterval(() => {
      currentRotation += 30;
      setRotation(currentRotation);
      
      // 720度（2回転）回ったらボールを表示
      if (currentRotation >= 720) {
        setShowBall(true);
      }
    }, 50);

    setTimeout(async () => {
      clearInterval(spinInterval);
      setResult(newResult);
      setStage('result');
      setShowBall(false);  // 結果表示時にボールを非表示
      setIsAnimating(false); // アニメーション終了
      
      try {
        await addPoints(newResult.points);
        await handleGenerateBingo();
        
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
      } catch (error) {
        console.error('ポイント追加またはビンゴシート生成中にエラーが発生しした:', error);
      } finally {
        setIsAddingPoints(false);
      }
    }, 2000);
  }, [completedLines, addPoints, isAddingPoints, handleGenerateBingo]);

  const handleClose = useCallback(() => {
    onClose();
    // ページをリロード
    window.location.reload();
  }, [onClose]);

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
        <h1>ビンゴガチャ</h1>
        <div className="bingo-gacha-content">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <div className="gacha-container">
                <motion.img
                  src="/gacha-image.png"
                  alt="ガチャ"
                  className="gacha-image"
                />
                <img
                  src="/gacha-base.png"
                  alt="ガチャ台座"
                  className="gacha-base"
                />
              </div>
            )}
            {stage === 'spinning' && (
              <div className="gacha-container">
                <motion.img
                  src="/gacha-image.png"
                  alt="ガチャ"
                  className="gacha-image"
                  style={{ 
                    rotate: rotation,
                    transformOrigin: 'center'
                  }}
                />
                <img
                  src="/gacha-base.png"  
                  alt="ガチャ台座"
                  className="gacha-base"
                />
                {showBall && (
                  <motion.div
                    className="gacha-ball"
                    style={{ background: ballColor }} // 状態に基づいて色を設定
                    initial={{ x: '-50%', y: '-50%' }}
                    animate={{ 
                      x: ['0%', '100%'],
                      y: ['0%', '100%'],
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  />
                )}
              </div>
            )}
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
            onClick={stage === 'idle' ? handlePullGacha : handleClose}
            disabled={isAddingPoints || stage === 'spinning' || isAnimating}
          >
            {stage === 'idle' ? (isAddingPoints ? '処理中...' : 'ガチャを回す') : '閉じる'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Bingo コンポーネント
export const Bingo: React.FC<BingoProps> = ({ userId, initialScore }) => {
  const [showGachaButton, setShowGachaButton] = useState(false);
  const [showGachaPopup, setShowGachaPopup] = useState(false);
  const [bingoKey, setBingoKey] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);
  const [totalPoints, setTotalPoints] = useState(initialScore);
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

  

  const handleGenerateBingo = useCallback(async () => {
    const newSheet = generateBingoSheet();
    setBingoSheet(newSheet);
    ////console.log('生成されたビンゴシート:', newSheet);
    setBingoKey(prevKey => prevKey + 1);
    setCompletedLines(0);
    setShowGachaButton(false);
    try {
      const input: CreateBingoSheetMutationVariables['input'] = {
        userId: userId,
        cells: newSheet,
      };
      const savedSheet = await createNewBingoSheet(input);
      ////console.log('新しいビンゴシートが保存されました:', savedSheet);
      if (savedSheet && savedSheet.id) {
        setCurrentSheetId(savedSheet.id);
        setBingoSheetExists(true);
      }
    } catch (error) {
      console.error('ンゴシートの保存に失敗しました:', error);
    }
  }, [userId]);

  const handleCloseGacha = useCallback(() => {
    setShowGachaPopup(false);
    setShowGachaButton(false);
    ////console.log('ガチャポップアップを閉じました');
    // ページをリロード
    window.location.reload();
  }, []);

  const loadBingoSheet = useCallback(async () => {
    try {
      const sheet = await fetchBingoSheet(userId);
      if (sheet && sheet.cells && sheet.cells.length > 0) {
        setBingoSheet(sheet.cells);
        setCurrentSheetId(sheet.id);
        setBingoSheetExists(true);
        //console.log('ビンゴシートをロードしましセル数:', sheet.cells.length);
        return sheet;
      } else {
        //console.log('保存されたビンゴシートが存在しません。');
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
    //console.log('loadPostsAndUpdateBingoSheet が呼び出されました');
    //console.log('ビンゴシートの作成時:', sheetCreatedAt);
    try {
      //console.log('投稿データを取得中...');
      const startDateString = sheetCreatedAt.toISOString();
      //console.log('startDateString:', startDateString);
      const fetchPostsResult = await fetchPosts(
        'POST',
        'すべて',
        null,
        1000,
        startDateString,
        undefined,
        userId
      );
      //console.log('fetchPosts の結果:', fetchPostsResult);
      const { posts } = fetchPostsResult;
      //console.log('取得した投稿データ:', posts);
      if (posts.length === 0) {
        //console.log('投稿データはありません。');
        return;
      }
      const categoriesWithDates: { category: string; createdAt: Date }[] = posts.map(post => ({
        category: post.category,
        createdAt: new Date((post as any).createdAt)
      }));
      categoriesWithDates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      //console.log('カテゴリと作成日時のペア:', categoriesWithDates);
      const filteredCategories = categoriesWithDates
        .filter(post => post.createdAt > sheetCreatedAt)
        .map(post => post.category);
      //console.log('フィルタリングされたカテゴリ:', filteredCategories);
      if (bingoSheet.length > 0) {
        let updatedSheet = [...bingoSheet];
        const updatedCategories: string[] = [];
        updatedSheet = updatedSheet.map(cell => {
          if (!cell.isCompleted && filteredCategories.includes(cell.category)) {
            //console.log(`カテゴリ "${cell.category}" を完了しました。`);
            updatedCategories.push(cell.category);
            return { ...cell, isCompleted: true, completedAt: new Date() };
          }
          return cell;
        });

        if (updatedCategories.length > 0) {
          //console.log('ビンゴシートの更新前:', bingoSheet);
          //console.log('ビンゴシートの更新後:', updatedSheet);
          setBingoSheet(updatedSheet);

          // ビンゴ判定を実行
          const completed = checkBingoLines(updatedSheet);
          setCompletedLines(completed);
          
          // ビンゴが1つ以上完成していればガチャボタンを表示
          if (completed > 0) {
            setShowGachaButton(true);
            //console.log(`ビンゴラインが${completed}本完成しました。ガチャボタンを表示します。`);
          } else {
            setShowGachaButton(false);
            //console.log('完成したビンゴラインはありません。');
          }

          // バックエンドの更新処理
          for (const category of updatedCategories) {
            if (currentSheetId) {
              try {
                await markCategoryAsCompleted(currentSheetId, category);
                //console.log(`バックエンドのビンゴシートも更新しました: カテゴリ "${category}" を完了しました。`);
              } catch (error) {
                console.error(`カテリ "${category}" の新に失敗しました:`, error);
              }
            }
          }
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
      //console.log('ビンゴシートのロード完了');
      if (sheet && sheet.createdAt) {
        const createdAt = new Date(sheet.createdAt);
        //console.log('ビンゴシートの作成日時:', createdAt);
        await loadPostsAndUpdateBingoSheet(createdAt);
      } else {
        //console.log('ビンゴシートの作成日時が設定されていません。');
      }
      setIsInitialized(true);
    };
    initializeBingoAndPosts();
  }, [isInitialized, loadBingoSheet, loadPostsAndUpdateBingoSheet]);

  useEffect(() => {
    setTotalPoints(initialScore);
  }, [initialScore]);

  const addPoints = useCallback(
    async (points: number) => {
      try {
        const newScore = totalPoints + points;
        setTotalPoints(newScore);
        await addPointsToUser(userId, points);
        //console.log(`${points} ポイント追加しました。新しいスコア: ${newScore}`);
      } catch (error) {
        console.error('ポイント追加エラー:', error);
      }
    },
    [totalPoints, userId]
  );

  const handleOpenGacha = useCallback(() => {
    //console.log('ガチャを開く前のビンゴ状態:');
    //console.log('完成したライン数:', completedLines);
    setShowGachaPopup(true);
    //console.log('ガチャポップアップを表示しました。');
  }, [completedLines]);

  useEffect(() => {
    //console.log(`showGachaButton の態が変更さました: ${showGachaButton}`);
  }, [showGachaButton]);

  useEffect(() => {
    const performBingoCheck = () => {
      if (boardRef.current && boardRef.current.checkBingo) {
        const lines = boardRef.current.checkBingo();
        //console.log(`ビンゴチェック結果: ${lines}本のラインが完成`);
        setCompletedLines(lines);
      } else {
        //console.log('boardRef.current または checkBingo が undefined です');
      }
    };

    if (bingoSheet.length > 0 && bingoSheetExists) {
      //console.log('ビンゴシートが更新されました。チェックを実行します。');
      performBingoCheck();
      setShowGachaButton(true);
    } else {
      //console.log('ビンゴシートが空か、存在しません');
    }
  }, [bingoSheet, bingoSheetExists]);

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
          background: linear-gradient(to right, #9ca3af, #6b7280);
        }
        .bingo-gacha-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background-color: #ffffff;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #fbbf24;
          width: 100%;
          max-width: 500px;
        }
        .bingo-gacha-board-cell {
          position: relative;
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          border: 1px solid #fbbf24;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: bold;
          color: #4a4a4a;
          text-align: center;
          padding: 0;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .bingo-gacha-board-cell:hover {
          transform: scale(1.05);
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
          padding: 1rem;
          max-width: 28rem;
          width: 90%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: center;
        }
        .bingo-gacha-content {
          width: 100%;
          height: 20rem;
          background-color: #f3f4f6;
          border-radius: 0.75rem;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
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
          gap: 2rem; /* タン間のスペース2remに増加 */
          flex-wrap: wrap; /* ボタンが小さい画面でも折り返す */
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
          margin-top: 1rem; 
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
          margin-top: 4rem;  // 1remから4remに変更
        }
        .gacha-image {
          width: 200px;
          height: 200px;
          object-fit: contain;
        }
        .bingo-gacha-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .gacha-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .gacha-image {
          width: 240px;
          height: 240px;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }
        .gacha-base {
          position: absolute;
          width: 240px;
          height: auto;
          bottom: -30px;
          left: 57%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .bingo-gacha-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          overflow: hidden;
        }
        .gacha-ball {
          position: absolute;
          width: 25px;
          height: 25px;
          background: linear-gradient(145deg, #ffffff, #e0e0e0);
          border-radius: 50%;
          right: 15%;
          bottom: 10%;
          z-index: 0;
          animation: fall 0.5s ease forwards, rotate 0.5s ease forwards;
        }
        .gachaHint: {
          fontSize: '14px',
          color: '#666',
          marginBottom: '20px',
          marginTop: '5px',
          textAlign: 'center' as const,
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(30px) rotate(360deg);
          }
        }
        .gacha-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;  // ボールがはみ出せるように
        }
      `}</style>

     {/* タイトルの追加 */}
     <div className="bingo-title">
        <AnimatedTitle />
      </div>
      <p style={styles.dataCollectionPeriod}>
        データ収集期間<br></br>
        11/18 (月) - 12/27 (金)
      </p>


      {/* ビンゴ生成ボタンとガチャボタン */}
      <div className="bingo-gacha-button-container">
        {!bingoSheetExists && (
          <Button onClick={handleGenerateBingo} disabled={false}>
            ビンゴを生成
          </Button>
        )}
        {bingoSheetExists && (
          <Button 
            onClick={handleOpenGacha} 
            disabled={completedLines === 0}
          >
            ガチャを表示 {completedLines > 0 && `(${completedLines}ライン完成)`}
          </Button>
        )}
      </div>
      <div style={styles.gachaHint}>
        ビンゴを揃えるとガチャを引けます！多く揃えると高ポイントのチャンス！
      </div>

      {/* ビンゴボードの表示 */}
      {bingoSheetExists && bingoSheet.length > 0 && (
        <div className="bingo-gacha-container">
          <BingoBoard 
            key={bingoKey} 
            bingoSheet={bingoSheet}
            ref={boardRef} 
          />
        </div>
      )}

      {/* ランキングを中央揃えで配置 */}
      <div className="ranking-wrapper">
        <UserRanking />
      </div>

      <AnimatePresence>
        {showGachaPopup && (
          <BingoGachaPopup
            onClose={handleCloseGacha} 
            completedLines={completedLines} 
            addPoints={addPoints}
            handleGenerateBingo={handleGenerateBingo}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  gachaHint: {
    fontSize: '16px',
    color: '#E95B6B', 
    marginBottom: '15px',
    marginTop: '20px', // 上部に余白を追加
    fontWeight: 'bold',
    textAlign: 'center' as const,
    animation: 'pulse 2s infinite', // アニメーションでワクワク感
  },
  dataCollectionPeriod: {
    color: 'black', // 好きな色に変更（例: 緑色）
    fontSize: '18px', // フォントサイズも調整可能
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '10px',
  },
}