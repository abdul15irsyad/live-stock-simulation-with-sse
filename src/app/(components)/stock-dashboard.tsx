'use client';

import { useEffect, useState } from 'react';
import {
  Text,
  Table,
  Badge,
  Group,
  Paper,
  Stack,
  ThemeIcon,
  Center,
  Loader,
  Box,
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { AreaChart } from '@mantine/charts';
import { StockData } from '@/types/stock';

export const StockDashboard = ({ symbol }: { symbol: string }) => {
  const [history, setHistory] = useState<StockData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const emptyPadding = Array(Math.max(0, 20 - history.length)).fill({
    time: '',
    price: null,
  });

  const chartData = [...emptyPadding, ...history].reverse().map((item) => ({
    time: item.time,
    price: item.price,
  }));

  useEffect(() => {
    const eventSource = new EventSource(`/api/stocks?symbol=${symbol}`);

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      const rawData = JSON.parse(event.data);
      const newData: StockData = {
        ...rawData,
        change: parseFloat(rawData.change),
      };
      setHistory((prev) => [newData, ...prev]);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [symbol]);

  const latest = history[0];
  const openPrice = history[history.length - 1]?.price;
  const percentFromOpen =
    latest && openPrice ? ((latest.price - openPrice) / openPrice) * 100 : 0;
  const isPositiveFromOpen = percentFromOpen >= 0;

  return (
    <Paper withBorder p='xl' radius='md'>
      <Stack gap='xl'>
        <Box>
          {latest ? (
            <Group justify='space-between'>
              <div>
                <Text size='md' c='dimmed' fw={700} tt='uppercase'>
                  {latest.symbol}
                </Text>
                <Text size='2rem' mb='xs' fw={900} style={{ lineHeight: 1 }}>
                  $ {latest?.price?.toFixed(2)}
                </Text>
                <Text size='xs' c='gray.7' tt={'uppercase'}>
                  Last Close: $ {openPrice?.toFixed(2)}
                </Text>
              </div>
              <Group gap='xs' align='center'>
                <ThemeIcon
                  color={isPositiveFromOpen ? 'teal' : 'red'}
                  variant='light'
                  size='lg'
                  radius='xl'
                >
                  {isPositiveFromOpen ? (
                    <IconArrowUpRight />
                  ) : (
                    <IconArrowDownRight />
                  )}
                </ThemeIcon>
                <Text
                  c={isPositiveFromOpen ? 'teal' : 'red'}
                  fw={700}
                  size='lg'
                >
                  <Box display='inline-block' mr={5}>
                    {isPositiveFromOpen ? '+' : ''}
                    {(latest.price - openPrice).toFixed(2)}
                  </Box>
                  ({isPositiveFromOpen ? '+' : ''}
                  {percentFromOpen.toFixed(2)}% )
                </Text>
              </Group>
            </Group>
          ) : (
            <Center h={100}>
              <Loader color='blue' type='dots' />
            </Center>
          )}
        </Box>
        <AreaChart
          h={200}
          data={chartData}
          dataKey='time'
          series={[
            {
              name: 'price',
              color: isPositiveFromOpen ? 'teal.6' : 'red.6',
            },
          ]}
          curveType='monotone'
          gridAxis='x'
          yAxisProps={{ domain: ['auto', 'auto'] }}
          xAxisProps={{ hide: true }}
          withDots={false}
          withTooltip={false}
          withGradient
          withXAxis={false}
          valueFormatter={(value) => `$${value}`}
        />
        <Table verticalSpacing='sm'>
          <Table.Thead bg='gray.0'>
            <Table.Tr>
              <Table.Th>Time</Table.Th>
              <Table.Th>Symbol</Table.Th>
              <Table.Th align='right'>Price</Table.Th>
              <Table.Th>Change</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {history?.slice(0, 5)?.map((item, idx) => (
              <Table.Tr key={idx}>
                <Table.Td>
                  <Text size='sm'>{item.time}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant='outline'>{item.symbol}</Badge>
                </Table.Td>
                <Table.Td fw={600}>${item.price.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Text
                    size='sm'
                    c={item.change >= 0 ? 'teal' : 'red'}
                    fw={700}
                  >
                    {item.change >= 0 ? '+' : ''}
                    {item.change.toFixed(2)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
};
