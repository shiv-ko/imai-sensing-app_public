// Bingo.tsx

import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

interface BingoBoardProps {
  onBingoComplete: (lines: number) => void;
}

export interface BingoBoardHandle {
  checkBingo: () => number;
  state: {
    board: { value: number; revealed: boolean }[];
  };
}

const BingoBoard = forwardRef<BingoBoardHandle, BingoBoardProps>(({ onBingoComplete }, ref) => {
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map((_, i) => ({ value: i + 1, revealed: false }))
  );

  const checkBingo = useCallback((newBoard: { value: number; revealed: boolean }[]) => {
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

    const completedLines = lines.filter(line => line.every(index => newBoard[index].revealed)).length;
    return completedLines;
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[index] = { ...newBoard[index], revealed: true };

        const completedLines = checkBingo(newBoard);
        if (completedLines > 0) {
          onBingoComplete(completedLines);
        }

        return newBoard;
      });
    },
    [checkBingo, onBingoComplete]
  );

  useImperativeHandle(ref, () => ({
    checkBingo: () => checkBingo(board),
    state: { board },
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
            backgroundColor: cell.revealed ? ['#fbbf24', '#f6ad55', '#f6ad55'] : '#e0e0e0',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          }}
        >
          {cell.revealed ? cell.value : '?'}
        </motion.div>
      ))}
    </div>
  );
});

BingoBoard.displayName = 'BingoBoard';

export default BingoBoard;
