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
    addPoints: (points: number) => Promise<void>; // 型を Promise<void> に変更
  }
  export interface BingoBoardProps {
    bingoSheet: { category: string; isCompleted: boolean }[];
    // onBingoComplete?: () => void; // いらない
  }

export interface UserSession {
  tokens?: {
    idToken?: {
      payload?: {
        sub?: string;
        nickname?: string;
        // 必要に応じて他のフィールドも追加してください
      };
    };
  };
}
