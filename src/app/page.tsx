'use client';

import { Container, Title, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';
import { StockDashboard } from './(components)/stock-dashboard';

export default function Home() {
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
        <StockDashboard symbol='TSLA' />
        <StockDashboard symbol='AAPL' />
      </Stack>
    </Container>
  );
}
