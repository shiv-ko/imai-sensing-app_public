import { atom } from "recoil";

export const capturedImageAtom = atom<File | null>({
  key: "capturedImage",
  default: null,
});