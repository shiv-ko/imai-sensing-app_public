// BingoGame.tsx

"use client"; // クライアントコンポーネントとしてマーク
import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import BingoBoard, { BingoBoardHandle } from './bingo';
import Gacha from './gacha';

// Button コンポーネントの定義
interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="bingo-gacha-button">
    {children}
  </button>
);

const BingoGame: React.FC = () => {
  const [showBingo, setShowBingo] = useState(true);
  const [showGachaButton, setShowGachaButton] = useState(false);
  const [showGachaPopup, setShowGachaPopup] = useState(false);
  const [bingoKey, setBingoKey] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const boardRef = useRef<BingoBoardHandle | null>(null);

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
    setShowBingo(true);
    setShowGachaButton(false);
    setBingoKey(prevKey => prevKey + 1);
    setCompletedLines(0);
  }, []);

  const addPoints = useCallback((points: number) => {
    setTotalPoints(prev => prev + points);
  }, []);

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
          font-size: 2.5rem;
          font-weight: bold;
          color: #fbbf24; /* ビンゴ内の黄色に統一 */
          border: 3px solid #fbbf24; /* 同じ黄色の枠線 */
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #ffffff; /* 背景を白にして黄色を際立たせる */
        }
        .total-points {
          font-size: 1.5rem;
          color: #4a4a4a; /* 色の彩度を落としてグレーに */
          margin-bottom: 2rem;
          text-align: center; /* ポイントテキストも中央揃え */
        }
        .bingo-gacha-button {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          background: linear-gradient(to right, #fbbf24, #f6ad55); /* ビンゴ内の黄色からオレンジへのグラデーション */
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 9999px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s;
        }
        .bingo-gacha-button:hover {
          transform: scale(1.05);
          background: linear-gradient(to right, #f6ad55, #fbbf24); /* ホバー時に逆方向のグラデーション */
        }
        .bingo-gacha-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bingo-gacha-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background-color: #ffffff; /* 白背景 */
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #fbbf24; /* 黄色の境界線でわかりやすく */
        }
        .bingo-gacha-board-cell {
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0; /* 灰色背景 */
          border: 1px solid #fbbf24; /* 黄色の境界線 */
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
          color: #4a4a4a; /* グレー文字 */
          transition: background-color 0.3s, transform 0.3s;
        }
        .bingo-gacha-board-cell.revealed {
          background-color: #fbbf24; /* 黄色に変更 */
          transform: scale(1.05);
          color: #ffffff; /* 白文字に変更 */
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
          background-color: #ffffff; /* 白背景 */
          border-radius: 0.5rem;
          padding: 1rem; /* 余白を減らす */
          max-width: 28rem; /* 幅を少し狭く */
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: center; /* テキストを中央揃え */
        }
        .bingo-gacha-content {
          width: 100%;
          height: 24rem;
          background-color: #f3f4f6; /* 薄い灰色背景 */
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
          background-color: #ffffff; /* 白背景 */
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
          color: #4a4a4a; /* グレー文字 */
        }
        .bingo-gacha-trophy {
          font-size: 4rem;
          margin-top: 1rem;
        }
        .result-text {
          margin: 0.5rem 0;
          font-size: 1.25rem;
          color: #4a4a4a; /* グレー文字 */
        }
        .bingo-gacha-text {
          font-size: 3.75rem;
          font-weight: bold;
          color: #fbbf24; /* ビンゴ内の黄色に統一 */
          position: absolute;
          z-index: 10;
        }
        .bingo-gacha-button-container {
          display: flex;
          justify-content: center;
        }
        .bingo-gacha-bold {
          font-weight: bold;
        }
      `}</style>

      {/* タイトルの追加 */}
      <div className="bingo-title">i-MYBINGO</div>
      <div className="total-points">総ポイント: {totalPoints}</div>

      {showBingo && (
        <div className="bingo-gacha-container">
          <BingoBoard key={bingoKey} onBingoComplete={handleBingoComplete} ref={boardRef} />
        </div>
      )}
      {showGachaButton && (
        <Button onClick={handleOpenGacha} disabled={false}>
          ガチャを表示
        </Button>
      )}
      <AnimatePresence>
        {showGachaPopup && (
          <Gacha
            onClose={handleCloseGacha}
            completedLines={completedLines}
            addPoints={addPoints}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BingoGame;
