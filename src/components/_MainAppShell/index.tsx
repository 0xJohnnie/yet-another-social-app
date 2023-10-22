'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  CopyButton,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import {
  IconCheck,
  IconCopy,
  IconHome,
  IconMessage,
  IconWallet,
} from '@tabler/icons-react';
import { useState } from 'react';
import { usePullToRefresh } from 'use-pull-to-refresh';

import GelatoTaskStatusLabel from '@/components/GelatoTaskStatus';
import { useAuthKit } from '@/hooks/useAuthKit';
import AppConfig from '@/utils/AppConfig';
import {
  _appShellHeight,
  _appShellHide,
  _appShellPadding,
  _buttonRadius,
  _iconSize,
  _variant,
} from '@/utils/constants';
import shortenWalletAddress from '@/utils/shortenWalletAddress';

import classes from './_MainAppShell.module.css';

interface NavbarURLs {
  label: string;
  webURL: string;
  icon?: React.ReactNode;
  color?: string;
  showButton: boolean;
  target?: string;
}

const Brand = dynamic(() => import('@/components/CTA'));
const InstallPWA = dynamic(() => import('@/components/Pwa'));

const MainAppShell = ({ children }: { children: any }) => {
  const {
    loginWeb3Auth,
    logoutWeb3Auth,
    web3Provider,
    ownerAddress,
    isAuthenticated,
    isLoadingWeb3Auth,
    safeAddress,
    isDeployingSafe,
    relayTransaction,
    isRelayerLoading,
    gelatoTaskId,
  } = useAuthKit();

  const [isOpened, { toggle }] = useDisclosure();
  const { width: screenWidth, height: screenHeight } = useViewportSize();

  const router = useRouter();
  const pathname = usePathname();
  const isHomePage: boolean = pathname === '/';

  const MAXIMUM_PULL_LENGTH = 300;
  const REFRESH_THRESHOLD = 180;

  const { isRefreshing } = usePullToRefresh({
    onRefresh: () => {
      if (!isDeployingSafe) {
        router.refresh();
      }
    },
    maximumPullLength: MAXIMUM_PULL_LENGTH,
    refreshThreshold: REFRESH_THRESHOLD,
    isDisabled: isDeployingSafe,
  });

  const publicURL: NavbarURLs[] = [
    {
      label: 'Home',
      webURL: `/`,
      showButton: true,
      icon: <IconHome size={_iconSize} stroke={1.5} />,
    },
    {
      label: 'View Transactions',
      webURL: `https://app.safe.global/transactions/history?safe=matic:${safeAddress}`,
      icon: <IconWallet size={_iconSize} stroke={1.5} />,
      showButton: safeAddress.length > 0,
      target: '_blank',
    },
    {
      label: 'Chat',
      webURL: `/chat`,
      showButton: true,
      icon: <IconMessage size={_iconSize} stroke={1.5} />,
    },
  ];

  const publicURLNav = publicURL.map(
    (item, index) =>
      item.showButton && (
        <Link
          href={item.webURL}
          key={item.label}
          onClick={toggle}
          target={item.target ?? '_self'}
          style={{ textDecoration: 'none' }}
        >
          <Button
            fz={18}
            px={16}
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
      ),
  );

  const [transactionHash, setTransactionHash] = useState<string>('');

  return screenHeight === 0 && screenWidth === 0 ? (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ blur: 2, backgroundOpacity: 0.08, color: '#5541d9' }}
      loaderProps={{ color: 'violet', type: 'dots', size: 128 }}
    />
  ) : (
    <>
      <LoadingOverlay
        visible={isLoadingWeb3Auth || isDeployingSafe || isRefreshing}
        zIndex={1000}
        overlayProps={{ blur: 2, backgroundOpacity: 0.08, color: '#5541d9' }}
        loaderProps={{ color: 'violet', type: 'dots', size: 128 }}
      />
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
          <Group justify="space-between" h="100%" gap="xs" preventGrowOverflow>
            <Burger
              opened={isOpened}
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

            <Group
              justify="flex-end"
              gap="xs"
              wrap="nowrap"
              preventGrowOverflow
            >
              {/* USER LOGGED IN : Wallet Info*/}
              {screenWidth > 575 &&
                isAuthenticated &&
                safeAddress.length > 0 && (
                  <Stack id="walletInfo" align="flex-end" gap={0}>
                    <Title order={5}>Your Wallet</Title>
                    <CopyButton value={safeAddress} timeout={1000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? 'Copied' : 'Copy wallet address'}
                          withArrow
                          position="right"
                        >
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            variant="subtle"
                            onClick={copy}
                          >
                            <Flex
                              justify="center"
                              align="center"
                              gap={5}
                              style={{ paddingRight: 110 }}
                            >
                              <Title order={5}>
                                {shortenWalletAddress(safeAddress)}
                              </Title>
                              {copied ? (
                                <IconCheck style={{ width: rem(16) }} />
                              ) : (
                                <IconCopy style={{ width: rem(16) }} />
                              )}
                            </Flex>
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Stack>
                )}
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
            {/* USER LOGGED IN : Wallet Info*/}
            {screenWidth <= 575 &&
              isAuthenticated &&
              safeAddress.length > 0 && (
                <Stack
                  id="walletInfo"
                  mb={_appShellPadding}
                  align="center"
                  gap={0}
                  p={8}
                >
                  <Title order={5}>Your Wallet</Title>
                  <CopyButton value={safeAddress} timeout={1000}>
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? 'Copied' : 'Copy wallet address'}
                        withArrow
                        position="right"
                      >
                        <ActionIcon
                          color={copied ? 'teal' : 'gray'}
                          variant="subtle"
                          onClick={copy}
                        >
                          <Flex justify="center" align="center" gap={5}>
                            <Title order={5}>
                              {shortenWalletAddress(safeAddress)}
                            </Title>
                            {copied ? (
                              <IconCheck style={{ width: rem(16) }} />
                            ) : (
                              <IconCopy style={{ width: rem(16) }} />
                            )}
                          </Flex>
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Stack>
              )}
            <Stack>{publicURLNav}</Stack>
          </AppShell.Section>
          {/* END : NAVBAR CONTENT */}

          {/* START : NAVBAR FOOTER */}
          <AppShell.Section>
            <Stack>
              {screenWidth >= 575 && <InstallPWA />}

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
        {/* +              END OF NAVBAR              + */}

        <AppShell.Main>
          <Stack m={8} h={screenHeight - 300}>
            {children}
          </Stack>

          <Stack justify="space-between">
            {!isAuthenticated && isHomePage && !isLoadingWeb3Auth && (
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
    </>
  );
};

export default MainAppShell;
