// src/features/dashboard/types/bingoTypes.ts

export interface BingoProps {
    userId: string;
    initialScore: number;
  }
  
  export interface BingoBoardHandle {
    checkBingo: () => number;
    state: {
      board: { category: string; isCompleted: boolean }[];
    };
  }
  
  export interface ButtonProps {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }
  
  export interface BingoGachaPopupProps {
    onClose: () => void;
    completedLines: number;
    addPoints: (points: number) => void;
  }
  
  export interface BingoBoardProps {
    bingoSheet: { category: string; isCompleted: boolean }[];
    onBingoComplete: (lines: number) => void;
  }
  