// // src/features/dashboard/components/bingoGame.tsx
// 'use client';

// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { AnimatePresence } from 'framer-motion';
// import BingoBoard, { BingoBoardHandle } from './bingo';
// import Gacha from './gacha';
// import { Amplify } from 'aws-amplify';
// import awsExports from '../../../aws-exports';
// import { generateClient } from '@aws-amplify/api'; 
// import { updateUser } from '../../../graphql/mutations';
// import { UpdateUserMutationVariables } from '../../../API';

// Amplify.configure(awsExports);

// const client = generateClient(); // クライアントを作成

// // ユーザーのスコアを更新する関数
// const updateUserScore = async (userId: string, newScore: number) => {
//   const input: UpdateUserMutationVariables['input'] = {
//     id: userId,
//     score: newScore,
//   };

//   try {
//     const result = await client.graphql({
//       query: updateUser,
//       variables: { input },
//     });
//     return result.data?.updateUser || null;
//   } catch (error) {
//     console.error('Error updating user score:', error);
//     throw new Error('ポイントの更新に失敗しました。');
//   }
// };

// // Button コンポーネントのインライン定義
// interface ButtonProps {
//   onClick: () => void;
//   disabled: boolean;
//   children: React.ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => (
//   <button onClick={onClick} disabled={disabled} className="bingo-gacha-button">
//     {children}
//   </button>
// );

// // アニメーション付きタイトルコンポーネント
// const AnimatedTitle: React.FC = () => {
//   const [animate, setAnimate] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setAnimate(true), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="title-container" aria-live="polite" aria-atomic="true">
//       <div className={`text-container ${animate ? 'animate' : ''}`}>
//         <div className="text i-my">i-MY</div>
//         <div className="text bin">-BIN</div>
//         <div className="text go">GO</div>
//       </div>
//       <style jsx>{`
//         .title-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 1rem;
//           background-color: #f9f9f9;
//           border-radius: 0.75rem;
//           margin-bottom: 2rem;
//           width: fit-content;
//           white-space: nowrap;
//         }
//         .text-container {
//           position: relative;
//           display: flex;
//           justify-content: center;
//           align-items: flex-start;
//           font-size: 2.5rem;
//           font-weight: 800;
//           letter-spacing: -0.05em;
//         }
//         .text {
//           display: inline-block;
//           transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
//         }
//         .i-my {
//           color: #7cb342;
//           text-shadow: 1px 1px 0px #c5e1a5;
//         }
//         .bin {
//           color: #9ccc65;
//           text-shadow: 1px 1px 0px #aed581;
//           position: absolute;
//           opacity: 0;
//           transform: scale(0);
//           transition: opacity 0.8s, transform 0.8s;
//           overflow: hidden;
//           white-space: nowrap;
//           width: 0;
//         }
//         .go {
//           color: #8bc34a;
//           text-shadow: 1px 1px 0px #dcedc8;
//         }
//         .text-container.animate .i-my {
//           animation: moveIMY 2.2s forwards, smoothColorChange 0.8s forwards 3.2s;
//         }
//         .text-container.animate .bin {
//           animation: explosiveBIN 2.4s forwards 0.7s, smoothColorChange 0.8s forwards 3.2s;
//         }
//         .text-container.animate .go {
//           animation: moveGO 2.2s forwards, smoothColorChange 0.8s forwards 3.2s;
//         }
//         @keyframes moveIMY {
//           0% { transform: translateX(0); }
//           20% { transform: translateX(-58%) scale(0.9); }
//           100% { transform: translateX(-55%) scale(1); }
//         }
//         @keyframes explosiveBIN {
//           0% {
//             opacity: 0;
//             transform: scale(0) rotate(0deg);
//             width: 0;
//             filter: blur(5px);
//           }
//           10% {
//             opacity: 1;
//             transform: scale(1.5) rotate(90deg);
//             width: auto;
//             filter: blur(0);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1) rotate(0deg);
//             width: auto;
//             filter: blur(0);
//           }
//         }
//         @keyframes moveGO {
//           0% { transform: translateX(0); }
//           20% { transform: translateX(53%) scale(0.9); }
//           100% { transform: translateX(50%) scale(1); }
//         }
//         @keyframes smoothColorChange {
//           0% { color: inherit; text-shadow: inherit; }
//           100% { 
//             color: #66bb6a; 
//             text-shadow: 1px 1px 0px #a5d6a7;
//           }
//         }
//         @media (max-width: 768px) {
//           .text-container {
//             font-size: 2rem;
//           }
//         }
//         @media (max-width: 480px) {
//           .text-container {
//             font-size: 1.5rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// const BingoGame: React.FC<{ userId: string; initialScore: number }> = ({ userId, initialScore }) => {
//   const [showBingo, setShowBingo] = useState(true);
//   const [showGachaButton, setShowGachaButton] = useState(false);
//   const [showGachaPopup, setShowGachaPopup] = useState(false);
//   const [bingoKey, setBingoKey] = useState(0);
//   const [completedLines, setCompletedLines] = useState(0);
//   const [totalPoints, setTotalPoints] = useState(initialScore);
//   const boardRef = useRef<BingoBoardHandle | null>(null);

//   const handleBingoComplete = useCallback((lines: number) => {
//     setCompletedLines(lines);
//     setShowGachaButton(true);
//   }, []);

//   const handleOpenGacha = useCallback(() => {
//     if (boardRef.current && boardRef.current.checkBingo) {
//       const recalculatedLines = boardRef.current.checkBingo();
//       setCompletedLines(recalculatedLines);
//     }
//     setShowGachaPopup(true);
//   }, []);

//   const handleCloseGacha = useCallback(() => {
//     setShowGachaPopup(false);
//     setShowBingo(true);
//     setShowGachaButton(false);
//     setBingoKey((prevKey) => prevKey + 1);
//     setCompletedLines(0);
//   }, []);

//   const addPoints = useCallback(
//     async (points: number) => {
//       const newScore = totalPoints + points;
//       setTotalPoints(newScore);

//       try {
//         await updateUserScore(userId, newScore);
//         console.log('User score updated successfully:', newScore);
//       } catch (error) {
//         console.error('Failed to update score:', error);
//       }
//     },
//     [totalPoints, userId]
//   );

//   return (
//     <div className="bingo-gacha-game">
//       <AnimatedTitle />
//       <div className="total-points">総ポイント: {totalPoints}</div>

//       {showBingo && (
//         <div className="bingo-gacha-container">
//           <BingoBoard key={bingoKey} onBingoComplete={handleBingoComplete} ref={boardRef} />
//         </div>
//       )}
//       {showGachaButton && (
//         <Button onClick={handleOpenGacha} disabled={false}>
//           ガチャを表示
//         </Button>
//       )}
//       <AnimatePresence>
//         {showGachaPopup && (
//           <Gacha onClose={handleCloseGacha} completedLines={completedLines} addPoints={addPoints} />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default BingoGame;
