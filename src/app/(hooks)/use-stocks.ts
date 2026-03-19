import { StockData, StockHistory, StockId } from '@/types/stock';
import { useState, useEffect, useMemo } from 'react';

export const useStocks = ({
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

    const symbols = stocks.map((stock) => stock.symbol);
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
  }, [stocks]);

  const datas = useMemo(() => {
    return stocks.map(({ name, symbol }) => {
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
