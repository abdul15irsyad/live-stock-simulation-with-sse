'use client';

import { useEffect, useMemo, useState } from 'react';
import { StockData, StockHistory, StockId } from '@/types/stock';

export const useStocksWithSplitSSE = ({
  stocks,
}: {
  stocks: StockId[];
}): { datas: StockData[] } => {
  const [stockState, setStockState] = useState<
    Record<
      string,
      {
        history: StockHistory[];
        isConnected: boolean;
      }
    >
  >({});

  useEffect(() => {
    if (!stocks.length) return;

    const eventSources: Record<string, EventSource> = {};

    const handleBeforeUnload = () => {
      Object.values(eventSources).forEach((eventSource) => eventSource.close());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    stocks.forEach(({ symbol }) => {
      const eventSource = new EventSource(`/api/stock?symbol=${symbol}`);
      eventSources[symbol] = eventSource;

      eventSource.onopen = () => {
        setStockState((prev) => ({
          ...prev,
          [symbol]: {
            history: prev[symbol]?.history || [],
            isConnected: true,
          },
        }));
      };

      eventSource.onmessage = (event) => {
        const raw = JSON.parse(event.data) as StockHistory;

        const newData: StockHistory = {
          ...raw,
          change: parseFloat(raw.change.toString()),
        };

        setStockState((prev) => {
          const prevState = prev[symbol] || {
            history: [],
            isConnected: true,
          };

          return {
            ...prev,
            [symbol]: {
              ...prevState,
              history: [newData, ...prevState.history],
            },
          };
        });
      };

      eventSource.onerror = () => {
        setStockState((prev) => ({
          ...prev,
          [symbol]: {
            ...(prev[symbol] || { history: [] }),
            isConnected: false,
          },
        }));
        eventSource.close();
      };
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      Object.values(eventSources).forEach((eventSource) => eventSource.close());
    };
  }, [stocks]);

  const datas = useMemo(() => {
    return stocks?.map(({ name, symbol }) => {
      const state = stockState[symbol] || { history: [], isConnected: false };
      const history = state.history;

      const emptyPadding = Array(Math.max(0, 20 - history.length)).fill({
        time: '',
        price: null,
      });

      const chartData = [...emptyPadding, ...history].reverse().map((item) => ({
        time: item.time,
        price: item.price,
      }));

      const latest = history[0];
      const openPrice = history[history.length - 1]?.price;

      const percentFromOpen =
        latest && openPrice
          ? ((latest.price - openPrice) / openPrice) * 100
          : 0;

      const stockData: StockData = {
        name,
        symbol,
        history,
        isConnected: state.isConnected,
        chartData,
        latest,
        openPrice,
        percentFromOpen,
        isPositiveFromOpen: percentFromOpen >= 0,
      };
      return stockData;
    });
  }, [stockState, stocks]);

  return { datas };
};
