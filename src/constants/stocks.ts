export const stocks: { symbol: string; name: string; currentPrice?: number }[] =
  [
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150 },
    { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 600 },
    { symbol: 'BABA', name: 'Alibaba Group', currentPrice: 160 },
    { symbol: 'META', name: 'Meta Platforms', currentPrice: 130 },
    { symbol: 'NKE', name: 'Nike Inc.', currentPrice: 53 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 1000 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', currentPrice: 200 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 180 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 900 },
    { symbol: 'NFLX', name: 'Netflix Inc.', currentPrice: 500 },
    { symbol: 'DIS', name: 'Walt Disney Co.', currentPrice: 120 },
    { symbol: 'INTC', name: 'Intel Corp.', currentPrice: 45 },
  ];

export const symbols = stocks.map((stock) => stock.symbol);
