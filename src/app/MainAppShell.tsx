'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  AppShell,
  Burger,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';

import { AppConfig } from '@/utils/AppConfig';
import {
  _appShellHeight,
  _appShellHide,
  _appShellPadding,
  _variant,
} from '@/utils/constants';

import classes from './MainAppShell.module.css';

const Brand = dynamic(() => import('@/components/_main/Navbar/_brand'));

const NavbarURLs = dynamic(() => import('@/components/_main/Navbar/NavbarURL'));

const InstallPWA = dynamic(() => import('@/components/_main/pwa'));

function MainAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // layout="alt"
      header={{ height: 100 }}
      navbar={{
        width: 250,
        breakpoint: _appShellHide,
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding={_appShellPadding}
    >
      <AppShell.Header p={_appShellPadding}>
        {/* +             START OF HEADER             + */}
        <Group justify="space-between" h="100%" gap="xs" preventGrowOverflow>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom={_appShellHide}
            size={_appShellPadding}
            aria-label="menu"
          />
          <UnstyledButton aria-label="logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Title className={classes.title}>
                <Text
                  inherit
                  variant="gradient"
                  component="span"
                  gradient={{ from: 'pink', to: 'yellow' }}
                >
                  {AppConfig.site_name}
                </Text>
              </Title>
            </Link>
          </UnstyledButton>
          <Group justify="flex-end" gap="xs" wrap="nowrap" preventGrowOverflow>
            <br />

            <Group
              justify="flex-end"
              gap="xs"
              wrap="nowrap"
              preventGrowOverflow
              hiddenFrom={_appShellHide}
            >
              <InstallPWA />
              {/* PUTTING components HERE WILL HIDE WHEN SIDEBAR IS CLOSED */}
            </Group>
          </Group>
        </Group>
        {/* +              END OF HEADER              + */}
      </AppShell.Header>
      <AppShell.Navbar p={_appShellPadding}>
        {/* +             START OF NAVBAR             + */}

        {/* START : NAVBAR CONTENT */}
        <AppShell.Section my={_appShellPadding} component={ScrollArea} grow>
          <NavbarURLs />
        </AppShell.Section>
        {/* END : NAVBAR CONTENT */}

        {/* START : NAVBAR FOOTER */}
        <AppShell.Section>
          <Stack>
            <InstallPWA />

            <Divider my={_appShellPadding} />

            <Brand />
          </Stack>
        </AppShell.Section>
        {/* END : NAVBAR FOOTER */}
      </AppShell.Navbar>
      {/* +              END OF NAVBAR              + */}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default MainAppShell;
