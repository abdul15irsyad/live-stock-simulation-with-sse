'use client';

import { Container, Title, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';
import { StockDashboard } from './(components)/stock-dashboard';
import { useStocksWithSplitSSE } from './(hooks)/use-stocks';
import { useMemo, useState } from 'react';
import { StockSummary } from './(components)/stock-summary';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'BABA', name: 'Alibaba Group' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOG', name: 'Alphabet Inc.' },
];

const symbols = stocks.map((stock) => stock.symbol);

export default function Home() {
  const { datas } = useStocksWithSplitSSE({ symbols });

  const [stockActive, setStockActive] = useState(symbols[0]);
  const stockDataActive = useMemo(
    () => datas?.find(({ symbol }) => symbol === stockActive),
    [datas, stockActive],
  );
  return (
    <Container size='md' py='xl'>
      <Stack gap='lg'>
        <Group justify='space-between'>
          <Group>
            <ThemeIcon variant='light' size='xl' color='blue'>
              <IconActivity size={24} />
            </ThemeIcon>
            <Stack gap={0}>
              <Title order={2} mb={0}>
                Live Stock Simulation
              </Title>
            </Stack>
          </Group>
        </Group>
        <Group>
          {datas.map((data) => {
            return (
              <StockSummary
                key={data.symbol}
                isActive={stockActive === data.symbol}
                setStockActive={setStockActive}
                stockData={data}
              />
            );
          })}
        </Group>
        {stockDataActive && <StockDashboard {...stockDataActive} />}
      </Stack>
    </Container>
  );
}
