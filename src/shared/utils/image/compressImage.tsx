import { imageConfig } from "./imageConfig";

const compressImage = async (file: File) => {
  try {
    // ブラウザ環境の場合のみ動的インポート
    if (typeof window !== "undefined") {
      const { readAndCompressImage } = await import("browser-image-resizer");

      const compressedBlob = await readAndCompressImage(file, imageConfig);

      // Convert Blob to File
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: new Date().getTime(),
      });

      return compressedFile;
    } else {
      console.error("Not in browser environment.");
      return file; // If not in browser environment, return the original file
    }
  } catch (error) {
    console.error("Failed to compress image:", error);
    return file; // If compression fails, return the original file
  }
};

export default compressImage;