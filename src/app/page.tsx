'use client';

import { useStocks } from './(hooks)/use-stocks';
import { Dashboard } from './(components)/dashboard';
import { useQueryState } from 'nuqs';
import { useStocksWithSplitSSE } from './(hooks)/use-stocks-with-split-sse';

const typeOptions: Record<string, typeof useStocks> = {
  merge: useStocks,
  split: useStocksWithSplitSSE,
} as const;

export default function Home() {
  const [type] = useQueryState('type', { defaultValue: 'merge' });
  return (
    <Dashboard useStockState={typeOptions[type] ?? typeOptions['merge']} />
  );
}
