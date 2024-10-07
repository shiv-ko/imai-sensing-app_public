// ページにアクセスしたときにユーザーが認証されているかどうかをチェックする
// 認証されている場合はホームにリダイレクトし、認証されていない場合はサインインページにリダイレクトする

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@aws-amplify/auth";

export const useCheckAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          router.push("/home");
        } else {
          router.push("/signin");
        }
      } catch (error) {
        router.push("/signin");
      }
    };
    checkUser();
  }, [router]);
};
