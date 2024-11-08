// src/features/dashboard/utils/bingoUtils.ts

import { categoriesList } from '../../../shared/utils/category/categoryList';

// カテゴリフィルタ
const filteredCategories = categoriesList.filter(category => 
  category.trim() !== 'すべて' && category.trim() !== '自治会に伝えたいこと'
);


// ガチャ関連の定数と関数
const basePointValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const baseProbabilities = [
  // 1ライン (3投稿): 2-3ポイント中心
  [0.15532, 0.55421, 0.15755, 0.08253, 0.03521, 0.00984, 0.00322, 0.00167, 0.00025, 0.00012, 0.00003, 0.00002, 0.00001, 0.00001, 0.00001, 0.00000, 0.00000, 0.00000, 0.00000, 0.00000],
  
  // 2ライン (5投稿): 2-4ポイント中心
  [0.13432, 0.35755, 0.29853, 0.12521, 0.04755, 0.01853, 0.00622, 0.00421, 0.00322, 0.00244, 0.00115, 0.00055, 0.00025, 0.00015, 0.00008, 0.00003, 0.00002, 0.00001, 0.00001, 0.00000],
  
  // 3ライン (6投稿): 3-5ポイント中心
  [0.11855, 0.25532, 0.24755, 0.17853, 0.08521, 0.03755, 0.02253, 0.02622, 0.01421, 0.00722, 0.00316, 0.00245, 0.00075, 0.00045, 0.00015, 0.00008, 0.00004, 0.00002, 0.00001, 0.00001],
  
  // 4ライン (7投稿): 4-6ポイント中心
  [0.09855, 0.15532, 0.19755, 0.19853, 0.12532, 0.08521, 0.04322, 0.03522, 0.02755, 0.01555, 0.00655, 0.00432, 0.00261, 0.00225, 0.00115, 0.00045, 0.00023, 0.00012, 0.00005, 0.00002],
  
  // 5ライン (8投稿): 5-7ポイント中心
  [0.07155, 0.09322, 0.15855, 0.19221, 0.19855, 0.09532, 0.05755, 0.04853, 0.03532, 0.01755, 0.01022, 0.00800, 0.00532, 0.00361, 0.00225, 0.00115, 0.00055, 0.00033, 0.00012, 0.00010],
  
  // 6ライン (9投稿): 6-8ポイント中心
  [0.05955, 0.05322, 0.09855, 0.15322, 0.19855, 0.14221, 0.09855, 0.07532, 0.04755, 0.02253, 0.01522, 0.01300, 0.00842, 0.00561, 0.00425, 0.00315, 0.00205, 0.00103, 0.00052, 0.00051],

  // 7ライン (10投稿): 7-10ポイント中心
  [0.03955, 0.02322, 0.05855, 0.09322, 0.15855, 0.19221, 0.14855, 0.12532, 0.05755, 0.03532, 0.02755, 0.01522, 0.01000, 0.00642, 0.00461, 0.00355, 0.00255, 0.00153, 0.00102, 0.00101],

  // 8ライン (11投稿): 8-12ポイント中心、15-20ポイントで合計10%
  [0.01955, 0.01322, 0.02855, 0.05322, 0.09855, 0.15322, 0.19855, 0.19221, 0.08855, 0.05532, 0.02755, 0.01522, 0.00800, 0.00442, 0.01261, 0.01155, 0.02105, 0.02083, 0.01542, 0.02041]
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
