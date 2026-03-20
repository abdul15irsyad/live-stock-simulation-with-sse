'use client';

import { Dashboard } from '../(components)/dashboard';
import { useStocksWithMergeSSE } from '../(hooks)/use-stocks-with-merge-sse';

export default function Home() {
  return <Dashboard useStockState={useStocksWithMergeSSE} />;
}
