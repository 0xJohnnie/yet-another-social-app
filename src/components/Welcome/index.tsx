import { Stack, Text, Title } from '@mantine/core';

import { _appShellPadding } from '@/utils/constants';

import classes from './Welcome.module.css';

const Welcome = () => {
  return (
    <>
      <Stack justify="space-between">
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
    </>
  );
};

export default Welcome;
