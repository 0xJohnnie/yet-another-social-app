'use client';

import Link from 'next/link';

import { Button, Stack, Text, Title } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';

import { _iconSize } from '@/utils/constants';

export const metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <Stack ta="center">
      <Title mt={100}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'purple', to: 'orange' }}
        >
          404 - PAGE NOT FOUND
        </Text>
      </Title>

      <Link href="/">
        <Button
          size="lg"
          leftSection={<IconArrowBack size={_iconSize} />}
          variant="filled"
        >
          Go home
        </Button>
      </Link>
    </Stack>
  );
}
