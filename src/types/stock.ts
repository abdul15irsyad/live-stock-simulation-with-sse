import { stocks } from '@/constants/stocks';

export interface StockHistory {
  symbol: string;
  price: number;
  change: number;
  time: string;
}

export type StockType = (typeof stocks)[number];
export type StockId = Pick<StockType, 'name' | 'symbol'>;

export type StockData = StockId & {
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
