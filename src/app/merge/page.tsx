'use client';

import { Suspense } from 'react';
import { Dashboard } from '../(components)/dashboard';
import { useStocksWithMergeSSE } from '../(hooks)/use-stocks-with-merge-sse';

export default function Home() {
  return (
    <Suspense>
      <Dashboard useStockState={useStocksWithMergeSSE} />;
    </Suspense>
  );
}
