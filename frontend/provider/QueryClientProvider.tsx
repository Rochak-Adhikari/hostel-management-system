'use client'

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type IProps = {
  children: ReactNode;
};

export const ReactQueryClientProvider = ({ children }: IProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
