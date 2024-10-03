"use client";

import {
  Box,
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// UserSessionType を定義
type UserSessionType = Awaited<ReturnType<typeof fetchAuthSession>>;

const Dashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const [userSession, setUserSession] = useState<UserSessionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 現在のユーザーセッションを取得
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const session = await fetchAuthSession();
        setUserSession(session);
      } catch (err: unknown) {
        console.error("セッション取得エラー", err);
        toast({
          title: "認証エラー",
          description:
            "認証されていないため、サインインページにリダイレクトします。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push("/"); // サインインページにリダイレクト
      }
    };
    fetchUserSession();
  }, [router, toast]);

  // サインアウト処理
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      toast({
        title: "サインアウト成功",
        description: "サインアウトに成功しました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/");
    } catch (err: unknown) {
      console.error("サインアウトエラー", err);
      const errorMessage =
        err instanceof Error ? err.message : "サインアウトに失敗しました。";
      setError(errorMessage);
      toast({
        title: "サインアウトエラー",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ユーザーのnicknameを取得
  const nickname = userSession?.tokens?.idToken?.payload?.nickname;
  const displayName = typeof nickname === "string" ? nickname : "ユーザー";

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading mb={6} textAlign="center">
        ダッシュボード
      </Heading>

      <VStack spacing={4} align="stretch">
        {/* エラーメッセージ */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* ユーザー情報の表示 */}
        {userSession ? (
          <Box>
            {/* ユーザー名の表示 */}
            <Heading size="md">ようこそ、{displayName}さん！</Heading>
          </Box>
        ) : (
          <Box>
            <Alert status="info">
              <AlertIcon />
              認証されたユーザーが見つかりません。
            </Alert>
          </Box>
        )}

        {/* サインアウトボタン */}
        <Button colorScheme="teal" onClick={handleSignOut} isLoading={loading}>
          サインアウト
        </Button>
      </VStack>
    </Box>
  );
};

export default Dashboard;
