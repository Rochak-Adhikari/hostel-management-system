'use client'

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type IProps = {
    children: ReactNode;
};

const queryClient = new QueryClient();

export const ReactQueryClientProvider = ({ children }: IProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
};