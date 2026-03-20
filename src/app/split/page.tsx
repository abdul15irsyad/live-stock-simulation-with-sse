'use client';

import { Suspense } from 'react';
import { Dashboard } from '../(components)/dashboard';
import { useStocksWithSplitSSE } from '../(hooks)/use-stocks-with-split-sse';

export default function Home() {
  return (
    <Suspense>
      <Dashboard useStockState={useStocksWithSplitSSE} />
    </Suspense>
  );
}
