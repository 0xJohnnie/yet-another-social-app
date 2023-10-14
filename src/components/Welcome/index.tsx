'use client';

import { Skeleton, Stack, Text, Title } from '@mantine/core';
import { Suspense, useEffect, useState } from 'react';

import { _appShellPadding } from '@/utils/constants';

import classes from './Welcome.module.css';

export function Welcome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Suspense fallback={<p>Loading feed...</p>}>
        <Stack>
          <Title className={classes.title} ta="center" mt={100}>
            Welcome to{' '}
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: 'pink', to: 'yellow' }}
            >
              YASA
            </Text>
          </Title>
          <br />
        </Stack>
      </Suspense>
    </>
  );
}
