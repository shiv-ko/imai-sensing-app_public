// bingoGenerator.ts
import { categoriesList } from '../../../shared/utils/category/categoryList';

// "All"を除いたカテゴリリスト
const filteredCategories = categoriesList.filter(category => category !== 'All');

// ビンゴシート生成関数
export const generateBingoSheet = () => {
  // ランダムにカテゴリを選択して9マスに配置する
  const newBingoSheet = Array(9).fill(null).map(() => {
    const randomIndex = Math.floor(Math.random() * filteredCategories.length);
    return {
      category: filteredCategories[randomIndex],
      isCompleted: false,
    };
  });

  return newBingoSheet;
};