'use client';

import React, { createContext, useContext, useState } from 'react';

interface PostContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <PostContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}; 