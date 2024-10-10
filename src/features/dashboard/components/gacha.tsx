// Gacha.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface GachaProps {
  completedLines: number;
  addPoints: (points: number) => void;
  onClose: () => void;
}

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
    points,
  };
}

const Button: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({
  onClick,
  disabled,
  children,
}) => (
  <button onClick={onClick} disabled={disabled} className="bingo-gacha-button">
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
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="bingo-gacha-popup"
    >
      <h2>ガチャ結果</h2>
      <p className="result-text">
        獲得ポイント: <span className="bingo-gacha-bold">{result.points}</span>
      </p>
      <Button onClick={onClose} disabled={false}>
        閉じる
      </Button>
    </motion.div>
  </motion.div>
);

const Gacha: React.FC<GachaProps> = ({ onClose, completedLines, addPoints }) => {
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
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
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
        <p className="result-text">完成したライン数: {completedLines}</p>
        <div className="bingo-gacha-content">
          <AnimatePresence mode="wait">
            {stage === 'result' && result && (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: 180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -180, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
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
                  transition={{ delay: 1, duration: 0.7, type: 'spring' }}
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
          {stage === 'popup' && result && <ResultPopup result={result} onClose={handleClosePopup} />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Gacha;
