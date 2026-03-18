import { currentPriceStocks } from '@/constants/stocks';
import { StockHistory } from '@/types/stock';
import { randomInt } from '@/utils/number';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const symbol = searchParams.get('symbol');
  if (!symbol) return;

  const stream = new ReadableStream({
    start(controller) {
      let currentPrice = currentPriceStocks[symbol];
      const data: StockHistory = {
        symbol,
        price: currentPrice,
        change: 0,
        time: new Date().toLocaleTimeString(),
      };

      controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);

      const timer = setInterval(() => {
        const change = parseFloat((randomInt(-200, 200) / 100).toFixed(2));
        currentPrice = parseFloat((currentPrice + change).toFixed(2));

        const data: StockHistory = {
          symbol,
          price: currentPrice,
          change: change,
          time: new Date().toLocaleTimeString(),
        };

        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
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
