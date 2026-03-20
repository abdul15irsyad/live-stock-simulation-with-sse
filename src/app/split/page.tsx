'use client';

import { Dashboard } from '../(components)/dashboard';
import { useStocksWithSplitSSE } from '../(hooks)/use-stocks-with-split-sse';

export default function Home() {
  return <Dashboard useStockState={useStocksWithSplitSSE} />;
}
