'use client';

import dynamic from 'next/dynamic';

import {
  Button,
  Divider,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useForm } from '@mantine/form';
import { useViewportSize } from '@mantine/hooks';
import { Utils } from 'alchemy-sdk';
import { useCallback, useEffect, useState } from 'react';

import GelatoTaskStatusLabel from '@/components/GelatoTaskStatus';
import { useAuthKit } from '@/hooks/useAuthKit';
import {
  _appShellHeight,
  _appShellHide,
  _appShellPadding,
  _buttonRadius,
  _iconSize,
  _variant,
} from '@/utils/constants';

const Welcome = dynamic(() => import('@/components/Welcome'));

const HomePage = () => {
  const {
    web3Provider,
    isAuthenticated,
    isLoadingWeb3Auth,
    safeAddress,
    isDeployingSafe,
    relayTransaction,
    isRelayerLoading,
    gelatoTaskId,
    setSafeBalance,
    safeBalance,
  } = useAuthKit();

  const [transactionHash, setTransactionHash] = useState<string>('');

  const { width: screenWidth, height: screenHeight } = useViewportSize();

  const form = useForm({
    initialValues: {
      walletAddress: '',
    },

    validate: {
      walletAddress: (value: string) =>
        value === safeAddress
          ? 'You cannot send to yourself'
          : value.length === 0
          ? 'Wallet Addresss cannot be empty'
          : value.length !== 42
          ? 'Wallet Address is not valid'
          : null,
    },
  });

  const updateBalance = useCallback(async () => {
    if (web3Provider) {
      const safeBal = await web3Provider.getBalance(safeAddress);

      console.warn('safebal', safeBal);

      setSafeBalance(Number(Utils.formatEther(safeBal)));
    }
  }, [safeAddress, setSafeBalance, web3Provider]);

  useEffect(() => {
    if (!isRelayerLoading || gelatoTaskId.length > 0) {
      updateBalance();
    }
  }, [gelatoTaskId.length, isRelayerLoading, updateBalance]);

  return screenHeight === 0 && screenWidth === 0 ? (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ blur: 2, backgroundOpacity: 0.08, color: '#5541d9' }}
      loaderProps={{ color: 'violet', type: 'dots', size: 128 }}
    />
  ) : (
    <>
      <Welcome />

      <Stack h={'100%'} justify="flex-start">
        {safeAddress ? (
          <>
            <Title order={3}>
              Transactions sent are sponsored via Gelato Network
            </Title>
            <Divider my={24} />
            <form
              onSubmit={form.onSubmit((values: { walletAddress: string }) => {
                relayTransaction(values.walletAddress);
              })}
            >
              <Title order={4}>Your Balance : {safeBalance} matic</Title>
              <TextInput
                mt={'lg'}
                label="Wallet Address"
                placeholder="Wallet Address"
                {...form.getInputProps('walletAddress')}
              />
              <Button
                mt={'lg'}
                type="submit"
                loading={isRelayerLoading}
                disabled={isRelayerLoading || safeBalance <= 0}
                fullWidth
              >
                Send 0.0001 Matic
              </Button>
            </form>
          </>
        ) : null}

        {(isRelayerLoading || gelatoTaskId) && safeAddress.length >= 0 && (
          <Stack mt={50}>
            {/* Gelato status label */}
            {gelatoTaskId && (
              <>
                <GelatoTaskStatusLabel
                  gelatoTaskId={gelatoTaskId}
                  setTransactionHash={setTransactionHash}
                  transactionHash={transactionHash}
                />
                <Divider my={24} />
              </>
            )}
          </Stack>
        )}

        {isLoadingWeb3Auth && (
          <Title ta="center" mt={100}>
            {isLoadingWeb3Auth && 'Loading...'}
          </Title>
        )}

        {isAuthenticated && safeAddress.length === 0 && isDeployingSafe && (
          <>
            <Title ta="center" mt={100}>
              Creating your wallet.
            </Title>
            <Title ta="center">This may take up to a minute</Title>
          </>
        )}
      </Stack>
    </>
  );
};

export default HomePage;
