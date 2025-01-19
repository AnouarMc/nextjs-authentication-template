"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingStateContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingStateContext = createContext<LoadingStateContextType | null>(null);

export default function LoadingStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingStateContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingStateContext.Provider>
  );
}

export function useLoadingState() {
  const context = useContext(LoadingStateContext);
  if (!context) {
    throw new Error(
      "useLoadingState must be used within a LoadingStateProvider"
    );
  }
  return context;
}
