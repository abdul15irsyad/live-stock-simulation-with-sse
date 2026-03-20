import { Group, ThemeIcon, Stack, Title, Button } from '@mantine/core';
import { IconActivity, IconExternalLink } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export const PageTitle = () => {
  const pathname = usePathname();
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
      <Group>
        {pathname === '/split' && (
          <Button
            leftSection={<IconExternalLink size='1rem' />}
            radius='md'
            color='blue'
            variant='outline'
            component='a'
            href='/merge'
          >
            Go to Merge SSE
          </Button>
        )}
        {pathname === '/merge' && (
          <Button
            leftSection={<IconExternalLink size='1rem' />}
            radius='md'
            color='blue'
            variant='outline'
            component='a'
            href='/split'
          >
            Go to Split SSE
          </Button>
        )}
      </Group>
    </Group>
  );
};
