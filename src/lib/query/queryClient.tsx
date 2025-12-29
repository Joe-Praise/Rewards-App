'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IProps {
  children: React.ReactNode;
}

export const queryClient = new QueryClient();

const QueryClientWrapper = ({ children }: IProps) => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </React.Fragment>
  );
};

export default QueryClientWrapper;
