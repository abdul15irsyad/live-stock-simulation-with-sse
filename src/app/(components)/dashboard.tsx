'use client';

import { Container, Stack, Grid } from '@mantine/core';
import { useMemo } from 'react';
import { stocks } from '@/constants/stocks';
import { useQueryState } from 'nuqs';
import { useStocks } from '../(hooks)/use-stocks';
import { PageTitle } from './page-title';
import { StockDashboard } from './stock-dashboard';
import { StockSummary } from './stock-summary';

export const Dashboard = ({
  useStockState,
}: {
  useStockState: typeof useStocks;
}) => {
  const { datas } = useStockState({ stocks });

  const [activeSymbol, setActiveSymbol] = useQueryState('active', {
    defaultValue: stocks[0]?.symbol,
    clearOnDefault: true,
  });
  const { stockActive, stockDataActive } = useMemo(() => {
    const stockActive =
      stocks.find(({ symbol }) => symbol === activeSymbol) ?? stocks[0];
    return {
      stockActive,
      stockDataActive: datas?.find(
        ({ symbol }) => symbol === stockActive.symbol,
      ),
    };
  }, [datas, activeSymbol]);
  return (
    <Container size='xl' py='xl'>
      <Stack gap='lg'>
        <PageTitle />
        <Grid>
          {datas.map((data) => {
            return (
              <Grid.Col key={data.symbol} span={4}>
                <StockSummary
                  isActive={stockActive.symbol === data.symbol}
                  onClick={() => setActiveSymbol(data.symbol)}
                  stockData={data}
                />
              </Grid.Col>
            );
          })}
        </Grid>
        {stockDataActive && <StockDashboard {...stockDataActive} />}
      </Stack>
      s
    </Container>
  );
};
