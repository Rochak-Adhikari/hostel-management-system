'use client'

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from "axios";

// backend le httpOnly cookie set garxa ra localhost:3000 -> localhost:8080 cross-origin ho,
// so withCredentials bina browser le Set-Cookie discard garxa ra cookie pathaudaina
axios.defaults.withCredentials = true;

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
