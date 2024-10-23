// src/features/dashboard/components/AnimatedTitle.tsx

'use client';

import React, { useState, useEffect } from 'react';

const AnimatedTitle: React.FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animated-title-container" aria-live="polite" aria-atomic="true">
      <div className={`animated-text-container ${animate ? 'animate' : ''}`}>
        <div className="animated-text animated-i-my">i-MY</div>
        <div className="animated-text animated-bin">-BIN</div>
        <div className="animated-text animated-go">GO</div>
      </div>
      <style jsx>{`
        .animated-title-container {
          display: flex;
          align-items: center;
          justify-content: flex-end; /* 右寄せに変更 */
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          width: fit-content;
          white-space: nowrap;
        }
        .animated-text-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-size: 4rem; /* フォントサイズを小さく設定 */
          font-weight: 800;
          letter-spacing: -0.05em;
        }
        .animated-text {
          display: inline-block;
          transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animated-i-my {
          color: #7cb342;
          text-shadow: 1px 1px 0px #c5e1a5;
        }
        .animated-bin {
          color: #9ccc65;
          text-shadow: 1px 1px 0px #aed581;
          position: absolute;
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.8s, transform 0.8s;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
        }
        .animated-go {
          color: #8bc34a;
          text-shadow: 1px 1px 0px #dcedc8;
        }
        .animated-text-container.animate .animated-i-my {
          animation: moveIMY 2.2s forwards, smoothColorChange 0.8s forwards 3.2s;
        }
        .animated-text-container.animate .animated-bin {
          animation: explosiveBIN 2.4s forwards 0.7s, smoothColorChange 0.8s forwards 3.2s;
        }
        .animated-text-container.animate .animated-go {
          animation: moveGO 2.2s forwards, smoothColorChange 0.8s forwards 3.2s;
        }
        @keyframes moveIMY {
          0% { transform: translateX(0); }
          20% { transform: translateX(-58%) scale(0.9); }
          40% { transform: translateX(-52%) scale(1.05); }
          60% { transform: translateX(-56%) scale(0.95); }
          80% { transform: translateX(-53%) scale(1.02); }
          100% { transform: translateX(-55%) scale(1); }
        }
        @keyframes explosiveBIN {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
            width: 0;
            filter: blur(5px);
          }
          10% {
            opacity: 1;
            transform: scale(1.5) rotate(90deg);
            width: auto;
            filter: blur(0);
          }
          30% {
            transform: scale(0.8) rotate(-45deg);
          }
          50% {
            transform: scale(1.2) rotate(22.5deg);
          }
          70% {
            transform: scale(0.9) rotate(-11.25deg);
          }
          85% {
            transform: scale(1.05) rotate(5.625deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            width: auto;
            filter: blur(0);
          }
        }
        @keyframes moveGO {
          0% { transform: translateX(0); }
          20% { transform: translateX(53%) scale(0.9); }
          40% { transform: translateX(47%) scale(1.05); }
          60% { transform: translateX(52%) scale(0.95); }
          80% { transform: translateX(48%) scale(1.02); }
          100% { transform: translateX(50%) scale(1); }
        }
        @keyframes smoothColorChange {
          0% { color: inherit; text-shadow: inherit; }
          100% { 
            color: #66bb6a; 
            text-shadow: 1px 1px 0px #a5d6a7;
          }
        }
        @media (max-width: 768px) {
          .animated-text-container {
            font-size: 3rem; /* レスポンシブ調整 */
          }
        }
        @media (max-width: 480px) {
          .animated-text-container {
            font-size: 2.5rem; /* レスポンシブ調整 */
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedTitle;
