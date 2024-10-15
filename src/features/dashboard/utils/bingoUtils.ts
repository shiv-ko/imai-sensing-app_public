// src/features/dashboard/utils/bingoUtils.ts

import { categoriesList } from '../../../shared/utils/category/categoryList';

// "All"を除いたカテゴリリスト
const filteredCategories = categoriesList.filter(category => category !== 'All');

// ガチャ関連の定数と関数
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

/**
 * ガチャを引く関数
 * @param completedLines 完成したライン数
 * @returns 獲得ポイント
 */
export function pullGacha(completedLines: number): { points: number } {
  if (completedLines < 1 || completedLines > baseProbabilities.length) {
    completedLines = 1;
  }
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

  return { points };
}

/**
 * ビンゴシートを生成する関数
 * 各セルにカテゴリ名とisCompletedフラグを持たせる
 * @returns 生成されたビンゴシート（カテゴリ名とフラグのオブジェクト配列）
 */
export function generateBingoSheet(): { category: string; isCompleted: boolean }[] {
  const newBingoSheet = Array(9)
    .fill(null)
    .map(() => {
      const randomIndex = Math.floor(Math.random() * filteredCategories.length);
      return {
        category: filteredCategories[randomIndex],
        isCompleted: false // 初期状態は未完了
      };
    });

  console.log('ビンゴシート生成:', newBingoSheet);
  return newBingoSheet;
}
