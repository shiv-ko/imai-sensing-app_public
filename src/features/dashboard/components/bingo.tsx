// bingo.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Constants
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

// Utility Functions
function pullGacha(completedLines: number) {
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

  return {
    points
  };
}

// Components
const Button: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bingo-gacha-button"
  >
    {children}
  </button>
);

const ResultPopup: React.FC<{ result: { points: number }; onClose: () => void }> = ({ result, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="bingo-gacha-overlay"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bingo-gacha-popup"
    >
      <h2>ガチャ結果</h2>
      <p className="result-text">
        獲得ポイント: <span className="bingo-gacha-bold">{result.points}</span>
      </p>
      <Button onClick={onClose} disabled={false}>閉じる</Button>
    </motion.div>
  </motion.div>
);

const BingoBoard = React.forwardRef<
  { checkBingo: () => number; state: { board: { value: number; revealed: boolean }[] } },
  { onBingoComplete: (lines: number) => void }
>(({ onBingoComplete }, ref) => {
  const [board, setBoard] = useState(Array(9).fill(null).map((_, i) => ({ value: i, revealed: false })));

  const checkBingo = useCallback((newBoard: { value: number; revealed: boolean }[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    const completedLines = lines.filter(line => line.every(index => newBoard[index].revealed)).length;
    return completedLines;
  }, []);

  const handleCellClick = useCallback((index: number) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[index] = { ...newBoard[index], revealed: true };
      
      const completedLines = checkBingo(newBoard);
      if (completedLines > 0) {
        onBingoComplete(completedLines);
      }
      
      return newBoard;
    });
  }, [checkBingo, onBingoComplete]);

  React.useImperativeHandle(ref, () => ({
    checkBingo: () => checkBingo(board),
    state: { board }
  }));

  return (
    <div className="bingo-gacha-board">
      {board.map((cell, index) => (
        <motion.div
          key={index}
          className={`bingo-gacha-board-cell ${cell.revealed ? 'revealed' : ''}`}
          onClick={() => handleCellClick(index)}
          animate={{ 
            scale: cell.revealed ? [1, 1.1, 1] : 1,
            backgroundColor: cell.revealed ? ['#fbbf24', '#f6ad55', '#f6ad55'] : '#e0e0e0'
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          {cell.revealed ? cell.value : '?'}
        </motion.div>
      ))}
    </div>
  );
});
BingoBoard.displayName = 'BingoBoard';

const BingoGachaPopup: React.FC<{ onClose: () => void; completedLines: number; addPoints: (points: number) => void }> = ({ onClose, completedLines, addPoints }) => {
  const [result, setResult] = useState<{ points: number } | null>(null);
  const [stage, setStage] = useState<'idle' | 'result' | 'popup'>('idle');
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
      // Confetti canvas を削除
      canvas.remove();
    }, 3000);
  }, [completedLines, addPoints]);

  const handleShowPopup = useCallback(() => {
    setStage('popup');
  }, []);

  const handleClosePopup = useCallback(() => {
    setStage('idle');
    setResult(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    // 自動的にガチャを引く
    if (stage === 'idle') {
      handlePullGacha();
    }
  }, [stage, handlePullGacha]);

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
            onClick={stage === 'result' ? handleShowPopup : handlePullGacha}
            disabled={stage !== 'idle' && stage !== 'result'}
          >
            {stage === 'idle' ? 'ガチャを回す' : stage === 'result' ? '結果を確認' : 'ガチャ実行中...'}
          </Button>
        </div>
        <AnimatePresence>
          {stage === 'popup' && result && (
            <ResultPopup result={result} onClose={handleClosePopup} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
BingoGachaPopup.displayName = 'BingoGachaPopup';

export function Bingo() {
  const [showBingo, setShowBingo] = useState(true);
  const [showGachaButton, setShowGachaButton] = useState(false);
  const [showGachaPopup, setShowGachaPopup] = useState(false);
  const [bingoKey, setBingoKey] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const boardRef = useRef<{ checkBingo: () => number; state: { board: { value: number; revealed: boolean }[] } } | null>(null);

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
          <BingoGachaPopup onClose={handleCloseGacha} completedLines={completedLines} addPoints={addPoints} />
        )}
      </AnimatePresence>
    </div>
  );
}
