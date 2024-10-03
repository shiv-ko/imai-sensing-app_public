"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { useState, useEffect } from "react";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  getCurrentUser,
} from "@aws-amplify/auth";
import { useRouter } from "next/navigation";

// Amplify の設定
Amplify.configure(awsExports);

const Page = () => {
  const router = useRouter();

  // フォームのモード管理
  const [mode, setMode] = useState<"signin" | "signup" | "confirm" | "success">(
    "signin"
  );

  // フォームの入力値管理
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); // 追加
  const [displayName, setDisplayName] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  // ローディング状態とエラーメッセージ管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Chakra UI のトースト通知
  const toast = useToast();

  // ユーザーが既にサインインしているか確認
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // ユーザーが既にサインインしている場合、ダッシュボードにリダイレクト
          router.push("/dashboard");
        }
      } catch (err) {
        // ユーザーがサインインしていない場合は何もしない
        console.log("ユーザーはサインインしていません");
      }
    };
    checkUser();
  }, [router]);

  // サインイン処理
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn({ username, password });
      setMessage("サインインに成功しました！");
      toast({
        title: "サインイン成功",
        description: "サインインに成功しました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // ダッシュボードページにリダイレクト
      router.push("/dashboard");
    } catch (err) {
      console.error("サインインエラー", err);
      if (err instanceof Error) {
        setError(err.message || "サインインに失敗しました。");
        toast({
          title: "サインインエラー",
          description: err.message || "サインインに失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError("サインインに失敗しました。");
        toast({
          title: "サインインエラー",
          description: "サインインに失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // サインアップ処理
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    // パスワードの一致確認
    if (password !== passwordConfirm) {
      setError("パスワードが一致しません。");
      setLoading(false);
      return;
    }

    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            nickname: displayName, // 必要に応じて他の属性も追加
          },
        },
      });
      setMode("confirm");
      setMessage(
        "確認コードが送信されました。メールまたはSMSを確認してください。"
      );
      toast({
        title: "サインアップ成功",
        description: "確認コードが送信されました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error("サインアップエラー", err);
      if (err instanceof Error) {
        setError(err.message || "サインアップに失敗しました。");
        toast({
          title: "サインアップエラー",
          description: err.message || "サインアップに失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError("サインアップに失敗しました。");
        toast({
          title: "サインアップエラー",
          description: "サインアップに失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 確認コードの確認処理
  const handleConfirmSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await confirmSignUp({
        username: username,
        confirmationCode: confirmationCode,
      });
      setMode("success");
      setMessage("サインアップが完了しました。サインインしてください。");
      toast({
        title: "確認成功",
        description: "サインアップが完了しました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error("確認エラー", err);
      if (err instanceof Error) {
        setError(err.message || "確認に失敗しました。");
        toast({
          title: "確認エラー",
          description: err.message || "確認に失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError("確認に失敗しました。");
        toast({
          title: "確認エラー",
          description: "確認に失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 確認コードの再送信処理
  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await resendSignUpCode({ username: username });
      setMessage(
        "確認コードを再送信しました。メールまたはSMSを確認してください。"
      );
      toast({
        title: "コード再送信",
        description: "確認コードを再送信しました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error("コード再送信エラー", err);
      if (err instanceof Error) {
        setError(err.message || "確認コードの再送信に失敗しました。");
        toast({
          title: "コード再送信エラー",
          description: err.message || "確認コードの再送信に失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError("確認コードの再送信に失敗しました。");
        toast({
          title: "コード再送信エラー",
          description: "確認コードの再送信に失敗しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
        {mode === "signin" && "サインイン"}
        {mode === "signup" && "サインアップ"}
        {mode === "confirm" && "確認コードの入力"}
        {mode === "success" && "サインアップ完了"}
      </Heading>

      <VStack spacing={4} align="stretch">
        {/* エラーメッセージ */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {/* 成功メッセージ */}
        {message && (
          <Alert status="success">
            <AlertIcon />
            {message}
          </Alert>
        )}

        {/* サインインフォーム */}
        {mode === "signin" && (
          <>
            <FormControl id="username" isRequired>
              <FormLabel>ユーザー名</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>パスワード</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
              />
            </FormControl>

            <Button
              colorScheme="teal"
              onClick={handleSignIn}
              isLoading={loading}
            >
              サインイン
            </Button>

            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => setMode("signup")}
            >
              アカウントをお持ちでない場合はサインアップ
            </Button>
          </>
        )}

        {/* サインアップフォーム */}
        {mode === "signup" && (
          <>
            <FormControl id="username" isRequired>
              <FormLabel>ユーザー名</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>パスワード</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
              />
            </FormControl>

            <FormControl id="passwordConfirm" isRequired>
              <FormLabel>パスワード確認</FormLabel>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="パスワードを再入力"
              />
            </FormControl>

            <FormControl id="displayName" isRequired>
              <FormLabel>表示名</FormLabel>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力"
              />
            </FormControl>

            <Button
              colorScheme="teal"
              onClick={handleSignUp}
              isLoading={loading}
            >
              サインアップ
            </Button>

            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => setMode("signin")}
            >
              既にアカウントをお持ちの場合はサインイン
            </Button>
          </>
        )}

        {/* 確認コード入力フォーム */}
        {mode === "confirm" && (
          <>
            <FormControl id="confirmationCode" isRequired>
              <FormLabel>確認コード</FormLabel>
              <Input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="確認コードを入力"
              />
            </FormControl>

            <Button
              colorScheme="teal"
              onClick={handleConfirmSignUp}
              isLoading={loading}
            >
              確認
            </Button>

            <Button
              variant="link"
              colorScheme="teal"
              onClick={handleResendCode}
              isLoading={loading}
            >
              確認コードを再送信
            </Button>
          </>
        )}

        {/* サインアップ完了メッセージ */}
        {mode === "success" && (
          <>
            <Alert status="success">
              <AlertIcon />
              {message}
            </Alert>
            <Button colorScheme="teal" onClick={() => setMode("signin")}>
              サインインページへ移動
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Page;
