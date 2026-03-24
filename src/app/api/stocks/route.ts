import { stocks } from '@/constants/stocks';
import { StockHistory } from '@/types/stock';
import { randomInt } from '@/utils/number';
import dayjs from 'dayjs';
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
        const currentPrice =
          stocks.find((stock) => symbol === stock.symbol)?.currentPrice ?? 0;
        if (currentPrice) {
          currentPrices[symbol] = currentPrice;
          initialData.push({
            symbol,
            price: currentPrices[symbol],
            change: 0,
            time: dayjs().toISOString(),
          });
        }
      });
      controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);

      const timers: Record<string, NodeJS.Timeout> = {};
      symbols.forEach((symbol) => {
        timers[symbol] = setInterval(
          () => {
            if (currentPrices[symbol] === undefined) return;

            const change = parseFloat((randomInt(-200, 200) / 100).toFixed(2));
            currentPrices[symbol] = parseFloat(
              (currentPrices[symbol] + change).toFixed(2),
            );

            const updatedDatas: StockHistory[] = [
              {
                symbol,
                price: currentPrices[symbol],
                change: change,
                time: dayjs().toISOString(),
              },
            ];
            controller.enqueue(`data: ${JSON.stringify(updatedDatas)}\n\n`);
          },
          randomInt(2000, 5000),
        );
      });

      req.signal.onabort = () => {
        Object.values(timers).map((timer) => {
          clearInterval(timer);
        });
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
