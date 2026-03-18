'use client';

import { useEffect, useMemo, useState } from 'react';
import { StockHistory } from '@/types/stock';

export type StockData = {
  symbol: string;
  history: StockHistory[];
  isConnected: boolean;
  chartData: {
    time: string;
    price: number | null;
  }[];
  latest: StockHistory;
  openPrice: number;
  percentFromOpen: number;
  isPositiveFromOpen: boolean;
};

export const useStocksWithSplitSSE = ({ symbols }: { symbols: string[] }) => {
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
    if (!symbols.length) return;

    const sources: Record<string, EventSource> = {};

    symbols.forEach((symbol) => {
      const es = new EventSource(`/api/stock?symbol=${symbol}`);
      sources[symbol] = es;

      es.onopen = () => {
        setStockState((prev) => ({
          ...prev,
          [symbol]: {
            history: prev[symbol]?.history || [],
            isConnected: true,
          },
        }));
      };

      es.onmessage = (event) => {
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

      es.onerror = () => {
        setStockState((prev) => ({
          ...prev,
          [symbol]: {
            ...(prev[symbol] || { history: [] }),
            isConnected: false,
          },
        }));
        es.close();
      };
    });

    return () => {
      Object.values(sources).forEach((es) => es.close());
    };
  }, [symbols]);

  const datas = useMemo(() => {
    return symbols.map((symbol) => {
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

      return {
        symbol,
        history,
        isConnected: state.isConnected,
        chartData,
        latest,
        openPrice,
        percentFromOpen,
        isPositiveFromOpen: percentFromOpen >= 0,
      };
    });
  }, [stockState, symbols]);

  return { datas };
};

export const useStocksWithMergeSSE = ({ symbols }: { symbols: string[] }) => {
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
    if (!symbols.length) return;

    const query = symbols.map(encodeURIComponent).join(',');
    const es = new EventSource(`/api/stocks?symbols=${query}`);

    es.onopen = () => {
      setStockState((prev) => {
        const next = { ...prev };
        symbols.forEach((symbol) => {
          next[symbol] = {
            history: next[symbol]?.history || [],
            isConnected: true,
          };
        });
        return next;
      });
    };

    es.onmessage = (event) => {
      const raw = JSON.parse(event.data) as StockHistory[];

      const newData = raw.map((item) => ({
        ...item,
        change: parseFloat(item.change.toString()),
      }));

      setStockState((prev) => {
        const next = { ...prev };
        newData.forEach((data) => {
          const prevState = next[data.symbol] || {
            history: [],
            isConnected: true,
          };

          next[data.symbol] = {
            ...prevState,
            history: [data, ...prevState.history],
          };
        });
        return next;
      });
    };

    es.onerror = () => {
      setStockState((prev) => {
        const next = { ...prev };
        symbols.forEach((symbol) => {
          next[symbol] = {
            ...(next[symbol] || { history: [] }),
            isConnected: false,
          };
        });
        return next;
      });
      es.close();
    };

    return () => {
      es.close();
    };
  }, [symbols]);

  const datas = useMemo(() => {
    return symbols.map((symbol) => {
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

      return {
        symbol,
        history,
        isConnected: state.isConnected,
        chartData,
        latest,
        openPrice,
        percentFromOpen,
        isPositiveFromOpen: percentFromOpen >= 0,
      };
    });
  }, [stockState, symbols]);

  return { datas };
};
