import { currentPriceStocks } from '@/constants/stocks';
import { StockHistory } from '@/types/stock';
import { randomInt } from '@/utils/number';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const symbolsParam = searchParams.get('symbols');
  if (!symbolsParam)
    return new Response('Missing symbols parameter', { status: 400 });

  const symbols = symbolsParam
    .split(',')
    .map((symbol) => symbol.trim())
    .filter((symbol) => symbol);

  const stream = new ReadableStream({
    start(controller) {
      const currentPrices: Record<string, number> = {};
      const initialData: StockHistory[] = [];

      symbols.forEach((symbol) => {
        if (currentPriceStocks[symbol]) {
          currentPrices[symbol] = currentPriceStocks[symbol];
          initialData.push({
            symbol,
            price: currentPrices[symbol],
            change: 0,
            time: new Date().toLocaleTimeString(),
          });
        }
      });

      // Send initial data for all symbols
      controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);

      const timer = setInterval(() => {
        const updatedData: StockHistory[] = [];

        symbols.forEach((symbol) => {
          if (currentPrices[symbol] !== undefined) {
            const change = parseFloat((randomInt(-200, 200) / 100).toFixed(2));
            currentPrices[symbol] = parseFloat(
              (currentPrices[symbol] + change).toFixed(2),
            );

            updatedData.push({
              symbol,
              price: currentPrices[symbol],
              change: change,
              time: new Date().toLocaleTimeString(),
            });
          }
        });

        if (updatedData.length > 0) {
          controller.enqueue(`data: ${JSON.stringify(updatedData)}\n\n`);
        }
      }, 3000);

      req.signal.onabort = () => {
        clearInterval(timer);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
