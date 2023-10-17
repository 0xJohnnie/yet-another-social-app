'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  AppShell,
  Burger,
  Button,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconWallet } from '@tabler/icons-react';
import { usePullToRefresh } from 'use-pull-to-refresh';

import useAuthKit from '@/hooks/useAuthKit';
import { AppConfig } from '@/utils/AppConfig';
import {
  _appShellHeight,
  _appShellHide,
  _appShellPadding,
  _buttonRadius,
  _iconSize,
  _variant,
} from '@/utils/constants';

import classes from './MainAppShell.module.css';

const Brand = dynamic(() => import('@/components/_main/CTA'));
const InstallPWA = dynamic(() => import('@/components/Pwa'));

interface NavbarURLs {
  label: string;
  webURL: string;
  icon?: React.ReactNode;
  color?: string;
}

function MainAppShell({ children }: { children: React.ReactNode }) {
  const [isOpened, { toggle }] = useDisclosure();
  const { width: screenWidth, height: screenHeight } = useViewportSize();

  const router = useRouter();
  const pathname = usePathname();
  const isHomePage: boolean = pathname === '/';

  const MAXIMUM_PULL_LENGTH = 300;
  const REFRESH_THRESHOLD = 180;

  const { isRefreshing } = usePullToRefresh({
    onRefresh: () => {
      router.refresh();
    },
    maximumPullLength: MAXIMUM_PULL_LENGTH,
    refreshThreshold: REFRESH_THRESHOLD,
  });

  const { loginWeb3Auth, logoutWeb3Auth, isAuthenticated, isLoadingWeb3Auth } =
    useAuthKit();

  const publicURL: NavbarURLs[] = [
    {
      label: 'Home',
      webURL: `/`,
    },
    {
      label: 'Dashboard',
      webURL: `/dashboard`,
      icon: <IconWallet size={_iconSize} stroke={1.5} />,
    },
  ];

  const publicURLNav = publicURL.map((item, index) => (
    <Link href={item.webURL} key={item.label} onClick={toggle}>
      <Button
        key={index}
        justify="flex-start"
        variant={_variant}
        leftSection={item.icon}
        aria-label={item.label}
        fullWidth
      >
        {item.label}
      </Button>
    </Link>
  ));

  return (
    <>
      <Skeleton visible={isLoadingWeb3Auth}>
        <AppShell
          // layout="alt"
          header={{ height: 100 }}
          navbar={{
            width: 250,
            breakpoint: _appShellHide,
            collapsed: { mobile: !isOpened, desktop: false },
          }}
          padding={_appShellPadding}
        >
          <AppShell.Header p={_appShellPadding}>
            {/* +             START OF HEADER             + */}
            <Group
              justify="space-between"
              h="100%"
              gap="xs"
              preventGrowOverflow
            >
              <Burger
                opened={isOpened}
                onClick={toggle}
                hiddenFrom={_appShellHide}
                size={_appShellPadding}
                aria-label="menu"
              />

              {isRefreshing ? (
                <Loader color="blue" type="dots" size={50} />
              ) : (
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
              )}

              <Group
                justify="flex-end"
                gap="xs"
                wrap="nowrap"
                preventGrowOverflow
              >
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

          <Skeleton visible={isLoadingWeb3Auth}>
            <AppShell.Navbar p={_appShellPadding}>
              {/* +             START OF NAVBAR             + */}

              {/* START : NAVBAR CONTENT */}
              <AppShell.Section
                my={_appShellPadding}
                component={ScrollArea}
                grow
              >
                <Stack>{publicURLNav}</Stack>
              </AppShell.Section>
              {/* END : NAVBAR CONTENT */}

              {/* START : NAVBAR FOOTER */}
              <AppShell.Section>
                <Stack>
                  {screenWidth >= 575 && !isOpened && <InstallPWA />}
                  {isAuthenticated && (
                    <>
                      <Divider my={_appShellPadding} />
                      <Button variant="contained" onClick={logoutWeb3Auth}>
                        Logout
                      </Button>
                    </>
                  )}
                  {!isAuthenticated && !isLoadingWeb3Auth && (
                    <Stack hiddenFrom={_appShellHide}>
                      <Divider my={_appShellPadding} />
                      <Button
                        variant="contained"
                        onClick={() => {
                          loginWeb3Auth();
                          toggle();
                        }}
                      >
                        Login
                      </Button>
                    </Stack>
                  )}
                  <Divider my={_appShellPadding} />

                  <Brand />
                </Stack>
              </AppShell.Section>
              {/* END : NAVBAR FOOTER */}
            </AppShell.Navbar>
          </Skeleton>
          {/* +              END OF NAVBAR              + */}

          <AppShell.Main>
            <Stack h={screenHeight - 240} justify="space-between">
              {children}

              {!isAuthenticated && isHomePage && (
                <Button
                  style={{ zIndex: screenWidth <= 576 && isOpened ? -1 : 1 }}
                  variant="contained"
                  onClick={loginWeb3Auth}
                >
                  Login
                </Button>
              )}
            </Stack>
          </AppShell.Main>
        </AppShell>
      </Skeleton>
    </>
  );
}

export default MainAppShell;
