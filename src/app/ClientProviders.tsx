"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";
import React from "react";

const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
