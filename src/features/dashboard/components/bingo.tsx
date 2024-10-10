// bingo.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Constants
const basePointValues = [1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20, 30, 50];
const baseProbabilities = [
  [0.25, 0.30, 0.20, 0.10, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00, 0.00, 0.00, 0.00], // 1 line
  [0.20, 0.25, 0.20, 0.15, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00, 0.00, 0.00], // 2 lines
  [0.15, 0.20, 0.20, 0.15, 0.10, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00, 0.00], // 3 lines
  [0.10, 0.15, 0.20, 0.15, 0.12, 0.10, 0.07, 0.05, 0.03, 0.02, 0.01, 0.00, 0.00], // 4 lines
  [0.05, 0.10, 0.15, 0.20, 0.15, 0.12, 0.08, 0.06, 0.04, 0.03, 0.01, 0.01, 0.00], // 5 lines
  [0.03, 0.07, 0.12, 0.15, 0.18, 0.15, 0.10, 0.08, 0.05, 0.04, 0.02, 0.01, 0.00], // 6 lines
  [0.02, 0.05, 0.08, 0.12, 0.15, 0.18, 0.15, 0.10, 0.07, 0.05, 0.02, 0.01, 0.00], // 7 lines
  [0.01, 0.03, 0.05, 0.08, 0.12, 0.15, 0.18, 0.15, 0.10, 0.07, 0.04, 0.02, 0.00]  // 8 lines
];

const fillProbabilities = [
  { min: 3, max: 5 },   // 1 point
  { min: 4, max: 7 },   // 2 points
  { min: 5, max: 9 },   // 3 points
  { min: 6, max: 11 },  // 4 points
  { min: 7, max: 13 },  // 5 points
  { min: 8, max: 15 },  // 6 points
  { min: 9, max: 17 },  // 7 points
  { min: 10, max: 19 }, // 8 points
  { min: 12, max: 21 }, // 10 points
  { min: 15, max: 22 }, // 15 points
  { min: 18, max: 23 }, // 20 points
  { min: 21, max: 24 }, // 30 points
  { min: 25, max: 25 }  // 50 points
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
  const fillProbability = fillProbabilities[selectedIndex];
  const fillAmount = Math.floor(Math.random() * (fillProbability.max - fillProbability.min + 1)) + fillProbability.min;

  return {
    points,
    fillAmount
  };
}

// Components
const Button = ({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bingo-gacha-button"
  >
    {children}
  </button>
);

const BingoCard = ({ onComplete, fillAmount }: { onComplete: () => void; fillAmount: number }) => {
  const [numbers, setNumbers] = useState(Array(25).fill(null).map((_, i) => i + 1));
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const getAnimationPattern = useCallback(() => {
    const patterns = [
      { name: 'normal', fillInterval: 140, pauseAt: [], pauseDuration: 0 },
      { name: 'quick', fillInterval: 50, pauseAt: [], pauseDuration: 0 },
      { name: 'pauseOnce', fillInterval: 140, pauseAt: [Math.floor(fillAmount / 2)], pauseDuration: 800 },
      { name: 'pauseTwice', fillInterval: 140, pauseAt: [Math.floor(fillAmount / 3), Math.floor(fillAmount * 2 / 3)], pauseDuration: 600 },
      { name: 'slowStart', fillInterval: 200, pauseAt: [Math.floor(fillAmount / 4)], pauseDuration: 400, secondInterval: 100 },
      { name: 'quickEnd', fillInterval: 180, pauseAt: [Math.floor(fillAmount * 3 / 4)], pauseDuration: 400, secondInterval: 60 },
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }, [fillAmount]);

  useEffect(() => {
    const pattern = getAnimationPattern();
    let currentInterval = pattern.fillInterval;
    let pauseIndex = 0;

    const interval = setInterval(() => {
      if (highlighted.length < fillAmount) {
        if (pattern.pauseAt.includes(highlighted.length) && !isPaused) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            if (pattern.secondInterval) {
              currentInterval = pattern.secondInterval;
            }
          }, pattern.pauseDuration);
          pauseIndex++;
        }
        if (!isPaused) {
          setHighlighted(prev => {
            const availableSquares = Array.from({ length: 25 }, (_, i) => i).filter(i => !prev.includes(i));
            const newSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
            return [...prev, newSquare];
          });
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1400);
      }
    }, currentInterval);

    return () => clearInterval(interval);
  }, [highlighted, onComplete, fillAmount, isPaused, getAnimationPattern]);

  return (
    <div className="bingo-gacha-card">
      {numbers.map((num, index) => (
        <motion.div
          key={index}
          className={`bingo-gacha-cell ${highlighted.includes(index) ? 'highlighted' : ''}`}
          animate={{ 
            scale: highlighted.includes(index) ? [1, 1.1, 1] : 1,
            backgroundColor: highlighted.includes(index) ? ['#E5E7EB', '#FBBF24', '#FBBF24'] : '#E5E7EB'
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          {num}
        </motion.div>
      ))}
    </div>
  );
};

const ResultPopup = ({ result, onClose }: { result: { points: number; fillAmount: number }; onClose: () => void }) => (
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
      <p>
        獲得ポイント: <span className="bingo-gacha-bold">{result.points}</span>
      </p>
      <Button onClick={onClose} disabled={false}>閉じる</Button>
    </motion.div>
  </motion.div>
);

const BingoBoard = React.forwardRef<{ checkBingo: () => number; state: { board: { value: number; revealed: boolean }[] } }, { onBingoComplete: (lines: number) => void }>(({ onBingoComplete }, ref) => {
  const [board, setBoard] = useState(Array(9).fill(null).map((_, i) => ({ value: i, revealed: false })));

  const checkBingo = useCallback((newBoard: { value: number; revealed: boolean }[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
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
            backgroundColor: cell.revealed ? ['#E5E7EB', '#FBBF24', '#FBBF24'] : '#E5E7EB'
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

const BingoGachaPopup = ({ onClose, completedLines }: { onClose: () => void; completedLines: number }) => {
  const [result, setResult] = useState<{ points: number; fillAmount: number } | null>(null);
  const [stage, setStage] = useState<'idle' | 'bingo' | 'bingoText' | 'result' | 'popup'>('idle');
  const confettiCanvasRef = useRef<HTMLDivElement>(null);

  const handlePullGacha = useCallback(() => {
    const newResult = pullGacha(completedLines);
    setResult(newResult);
    setStage('bingo');
  }, [completedLines]);

  const handleBingoComplete = useCallback(() => {
    setStage('bingoText');
    
    // Create a new canvas for confetti
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
      setStage('result');
      // Remove the confetti canvas after the animation
      canvas.remove();
    }, 3000);
  }, []);

  const handleShowPopup = useCallback(() => {
    setStage('popup');
  }, []);

  const handleClosePopup = useCallback(() => {
    setStage('idle');
    setResult(null);
    onClose();
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
        className="bingo-gacha-popup gacha-popup"
        ref={confettiCanvasRef}
      >
        <h2>ビンゴガチャ</h2>
        <p>完成したライン数: {completedLines}</p>
        <div className="bingo-gacha-content">
          <AnimatePresence mode="wait">
            {stage === 'bingo' && result && (
              <motion.div
                key="bingo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BingoCard 
                  onComplete={handleBingoComplete} 
                  fillAmount={result.fillAmount}
                />
              </motion.div>
            )}
            {(stage === 'bingoText' || stage === 'result') && (
              <motion.div
                key="bingoText"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="bingo-gacha-text"
              >
                BINGO
              </motion.div>
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

export function Bingo() {
  const [showBingo, setShowBingo] = useState(true);
  const [showGachaButton, setShowGachaButton] = useState(false);
  const [showGachaPopup, setShowGachaPopup] = useState(false);
  const [bingoKey, setBingoKey] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);
  const boardRef = useRef<{ checkBingo: () => number; state: { board: { value: number; revealed: boolean }[] } } | null>(null);

  const handleBingoComplete = useCallback((lines: number) => {
    setCompletedLines(lines);
    setShowGachaButton(true);
  }, []);

  const handleOpenGacha = useCallback(() => {
    // Recalculate completed lines
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
    setBingoKey(prevKey => prevKey + 1); // This will force a re-render of the BingoBoard
    setCompletedLines(0);
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
        }
        .bingo-gacha-button {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          background: linear-gradient(to right, #f6e05e, #ed8936);
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
          background: linear-gradient(to right, #f6ad55, #ed8936);
        }
        .bingo-gacha-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bingo-gacha-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
        .bingo-gacha-board-cell {
          width: 5rem;
          height: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .bingo-gacha-board-cell.revealed {
          background-color: #fbbf24;
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
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          max-width: 32rem;
          width: 100%;
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
        .bingo-gacha-card {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .bingo-gacha-cell {
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e5e7eb;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: bold;
        }
        .bingo-gacha-cell.highlighted {
          background-color: #fbbf24;
        }
        .bingo-gacha-text {
          font-size: 3.75rem;
          font-weight: bold;
          color: #fbbf24;
          position: absolute;
          z-index: 10;
        }
        .bingo-gacha-result-circle {
          width: 16rem;
          height: 16rem;
          border-radius: 9999px;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          z-index: 30;
        }
        .bingo-gacha-result-circle h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .bingo-gacha-trophy {
          font-size: 4rem;
          margin-top: 1rem;
        }
        .bingo-gacha-button-container {
          display: flex;
          justify-content: center;
        }
        .bingo-gacha-bold {
          font-weight: bold;
        }
      `}</style>
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
          <BingoGachaPopup onClose={handleCloseGacha} completedLines={completedLines} />
        )}
      </AnimatePresence>
    </div>
  );
}