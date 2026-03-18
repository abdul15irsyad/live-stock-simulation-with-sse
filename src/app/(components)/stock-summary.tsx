import { Dispatch, SetStateAction } from 'react';
import { StockData } from '../(hooks)/use-stocks';
import {
  Box,
  Group,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export const StockSummary = ({
  stockData,
  isActive,
  setStockActive,
}: {
  stockData: StockData;
  isActive: boolean;
  setStockActive: Dispatch<SetStateAction<string>>;
}) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  return (
    <Box
      ref={ref}
      onClick={() => setStockActive(stockData.symbol)}
      bg={isActive ? 'gray.1' : hovered ? 'gray.0' : undefined}
      p={'lg'}
      bdrs={'md'}
      bd={`1px solid ${isActive ? theme.colors.gray[4] : theme.colors.gray[4]}`}
      style={{
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      <Group miw={'200px'} justify='space-between'>
        <Stack gap='0rem'>
          <Text size={'1rem'} fw={700}>
            {stockData.symbol}
          </Text>
          <Text size={'sm'} c='gray.6'>
            {stockData.symbol}
          </Text>
          {stockData.history?.length > 0 && (
            <Text size={'sm'} c='gray.6'>
              $ {stockData.latest?.price?.toFixed(2)}
            </Text>
          )}
        </Stack>
        {stockData.latest && (
          <Group gap='xs' align='center'>
            <ThemeIcon
              color={stockData.isPositiveFromOpen ? 'teal' : 'red'}
              variant='light'
              size='xs'
              radius='xl'
            >
              {stockData.isPositiveFromOpen ? (
                <IconArrowUpRight />
              ) : (
                <IconArrowDownRight />
              )}
            </ThemeIcon>
            <Text
              c={stockData.isPositiveFromOpen ? 'teal' : 'red'}
              fw={400}
              size='sm'
              ta={'right'}
            >
              <Box mr={5}>
                {stockData.isPositiveFromOpen ? '+' : ''}
                {(stockData.latest?.price - stockData.openPrice).toFixed(2)}
              </Box>
              ({stockData.isPositiveFromOpen ? '+' : ''}
              {stockData.percentFromOpen.toFixed(2)}% )
            </Text>
          </Group>
        )}
      </Group>
    </Box>
  );
};
