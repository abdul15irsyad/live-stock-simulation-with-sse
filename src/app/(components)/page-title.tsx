import { Group, ThemeIcon, Stack, Title } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';

export const PageTitle = () => {
  return (
    <Group justify='space-between'>
      <Group>
        <ThemeIcon variant='light' size='xl' color='gray.7' radius={'lg'}>
          <IconActivity size={24} />
        </ThemeIcon>
        <Stack gap={0}>
          <Title order={2} mb={0}>
            Stock Simulation
          </Title>
        </Stack>
      </Group>
    </Group>
  );
};
