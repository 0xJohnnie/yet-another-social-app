import { ActionIcon, Group, Stack } from '@mantine/core';
import { IconBrandGithub, IconBrandTwitter } from '@tabler/icons-react';

import { _iconSize } from '@/utils/constants';

const CTA = () => {
  return (
    <Stack>
      <Group justify="center">
        <ActionIcon
          aria-label="0xJohnnie Twitter"
          size="xl"
          radius="xl"
          variant="filled"
          component="a"
          href="https://twitter.com/0xJohnnie"
          target="_blank"
        >
          <IconBrandTwitter size={_iconSize} stroke={1.5} />
        </ActionIcon>

        <ActionIcon
          aria-label="0xJohnnie Github"
          size="xl"
          radius="xl"
          variant="filled"
          component="a"
          href="https://github.com/0xJohnnie"
          target="_blank"
        >
          <IconBrandGithub size={_iconSize} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default CTA;
