// src/features/dashboard/utils/bingoUtils.ts

import { categoriesList } from '../../../shared/utils/category/categoryList';

// 'すべて' カテゴリーを除外
const filteredCategories = categoriesList.filter(category => category.trim() !== 'すべて');

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



export const generateBingoSheet = () => {
  // カテゴリーの数を確認
  if (filteredCategories.length < 9) {
    throw new Error('カテゴリーの数が9未満です。');
  }

  // Fisher-Yatesアルゴリズムを使用してカテゴリーをシャッフル
  const shuffledCategories = [...filteredCategories];
  for (let i = shuffledCategories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
  }

  // シャッフルされたカテゴリーから最初の9つを選択
  const selectedCategories = shuffledCategories.slice(0, 9);

  // 重複がないか確認（デバッグ用）
  const uniqueCategories = new Set(selectedCategories);
  if (uniqueCategories.size !== selectedCategories.length) {
    throw new Error('選択されたカテゴリーに重複があります。');
  }

  // ビンゴシートを生成
  const newBingoSheet = selectedCategories.map(category => ({
    category,
    isCompleted: false,
  }));

  return newBingoSheet;
};
