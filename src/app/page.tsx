"use client";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

export default function Page() {
  return (
    <>
      <div>Chakra Test</div>
      <CircularProgress value={70} size="100px" color="blue.400">
        <CircularProgressLabel>70%</CircularProgressLabel>
      </CircularProgress>
    </>
  );
}
