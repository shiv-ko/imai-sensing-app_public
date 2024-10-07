// app/page.tsx
"use client";

import { useCheckAuth } from "@/features/auth/hooks/useCheckAuth";

const HomePage = () => {
  useCheckAuth();
  return null;
};

export default HomePage;
