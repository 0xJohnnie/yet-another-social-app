'use client';

import { Button, Stack } from '@mantine/core';
import { IconWallet } from '@tabler/icons-react';

import {
  _appShellPadding,
  _iconSize,
  _lightHoverColor,
  _variant,
} from '@/utils/constants';

interface NavbarURLs {
  icon?: React.ReactNode;
  color?: string;
  label: string;
  webURL?: string;
}

const NavbarURLs = () => {
  const publicURL = [
    {
      label: 'Home',
      webURL: `/`,
      icon: <IconWallet size={_iconSize} stroke={1.5} />,
    },
  ];

  const publicURLNav = publicURL.map((item, index) => (
    <Button
      justify="flex-start"
      variant={_variant}
      leftSection={item.icon}
      aria-label={item.label}
      key={item.label}
      href={item.webURL}
      component="a"
    >
      {item.label}
    </Button>
  ));

  return (
    <>
      <Stack>{publicURLNav}</Stack>
    </>
  );
};

export default NavbarURLs;
