'use client';

import { Container, Stack, ScrollArea, Flex } from '@mantine/core';
import { useMemo } from 'react';
import { stocks } from '@/constants/stocks';
import { useQueryState } from 'nuqs';
import { useStocksWithMergeSSE } from '../(hooks)/use-stocks-with-merge-sse';
import { PageTitle } from './page-title';
import { StockDashboard } from './stock-dashboard';
import { StockSummary } from './stock-summary';
import { useStocksWithSplitSSE } from '../(hooks)/use-stocks-with-split-sse';

export const Dashboard = ({
  useStockState,
}: {
  useStockState: typeof useStocksWithMergeSSE | typeof useStocksWithSplitSSE;
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
        <ScrollArea w='100%' pb='md'>
          <Flex gap='md'>
            {datas.map((data, index) => {
              return (
                <StockSummary
                  index={index}
                  key={data.symbol}
                  isActive={stockActive.symbol === data.symbol}
                  onClick={() => setActiveSymbol(data.symbol)}
                  stockData={data}
                />
              );
            })}
          </Flex>
        </ScrollArea>
        {stockDataActive && <StockDashboard {...stockDataActive} />}
      </Stack>
    </Container>
  );
};
