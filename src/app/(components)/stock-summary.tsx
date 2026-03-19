import {
  Box,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconMinus,
} from '@tabler/icons-react';
import { StockData } from '@/types/stock';

export const StockSummary = ({
  stockData,
  isActive,
  onClick,
}: {
  stockData: StockData;
  isActive: boolean;
  onClick: () => void;
}) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  const {
    name,
    history,
    symbol,
    latest,
    percentFromOpen,
    isPositiveFromOpen,
    openPrice,
  } = stockData;
  const moveColor =
    percentFromOpen > 0 ? 'teal' : percentFromOpen < 0 ? 'red' : 'gray';
  return (
    <Box
      ref={ref}
      onClick={onClick}
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
            {name}
          </Text>
          <Text size={'sm'} c='gray.6'>
            {symbol}
          </Text>
          {history?.length > 0 && (
            <Text size={'sm'} c='gray.6'>
              $ {latest?.price?.toFixed(2)}
            </Text>
          )}
        </Stack>
        {latest ? (
          <Group gap='xs' align='center'>
            <ThemeIcon color={moveColor} variant='light' size='xs' radius='sm'>
              {percentFromOpen > 0 ? (
                <IconArrowUpRight />
              ) : percentFromOpen < 0 ? (
                <IconArrowDownRight />
              ) : (
                <IconMinus />
              )}
            </ThemeIcon>
            <Text c={moveColor} fw={400} size='sm' ta={'right'}>
              <Box mr={5}>
                {isPositiveFromOpen ? '+' : ''}
                {(latest?.price - openPrice).toFixed(2)}
              </Box>
              <span>
                ({isPositiveFromOpen ? '+' : ''}
                {percentFromOpen.toFixed(2)}%)
              </span>
            </Text>
          </Group>
        ) : (
          <Loader color='gray.5' type='dots' size='sm' />
        )}
      </Group>
    </Box>
  );
};
