'use client';

import { Anchor, Box, Progress, Stack, Text, Title } from '@mantine/core';
import { GelatoRelayPack } from '@safe-global/relay-kit';
import { useCallback, useEffect, useState } from 'react';

import useApi from '@/hooks/useApi';
import { useAuthKit } from '@/hooks/useAuthKit';
import shortenWalletAddress from '@/utils/shortenWalletAddress';

declare type TransactionStatusResponse = {
  chainId: number;
  taskId: string;
  taskState: TaskState;
  creationDate: string;
  lastCheckDate?: string;
  lastCheckMessage?: string;
  transactionHash?: string;
  blockNumber?: number;
  executionDate?: string;
};
enum TaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  WaitingForConfirmation = 'WaitingForConfirmation',
  Blacklisted = 'Blacklisted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound',
}

type GelatoTaskStatusLabelProps = {
  gelatoTaskId: string;
  transactionHash?: string;
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
};

const GelatoTaskStatusLabel = ({
  gelatoTaskId = '',
  transactionHash = '',
  setTransactionHash,
}: GelatoTaskStatusLabelProps) => {
  const { setIsRelayerLoading } = useAuthKit();

  const fetchGelatoTaskInfo = useCallback(
    async () =>
      await new GelatoRelayPack(
        process.env.NEXT_PUBLIC_GELATO_RELAY_KEY,
      ).getTaskStatus(gelatoTaskId),
    [gelatoTaskId],
  );

  const pollingTime = 5000;
  const [stopApiCall, setStopApiCall] = useState<boolean>(false);

  const { data: gelatoTaskInfo } = useApi(
    fetchGelatoTaskInfo,
    pollingTime,
    stopApiCall,
  );

  console.log('gelato status', gelatoTaskInfo);

  const isCancelled = gelatoTaskInfo?.taskState === 'Cancelled';
  const isSuccess = gelatoTaskInfo?.taskState === 'ExecSuccess';
  const isLoading = !isCancelled && !isSuccess;

  useEffect(() => {
    const stoppingStates = [
      'ExecSuccess',
      'ExecReverted',
      'Blacklisted',
      'NotFound',
      'Cancelled',
    ];

    if (
      gelatoTaskInfo?.transactionHash &&
      stoppingStates.includes(gelatoTaskInfo.taskState)
    ) {
      setTransactionHash(gelatoTaskInfo.transactionHash);

      console.warn('stopping API call');
      setStopApiCall(true);
      setIsRelayerLoading(false);
    }
  }, [gelatoTaskInfo, setIsRelayerLoading, setTransactionHash]);

  return (
    <>
      <Stack justify="center" align="flex-start">
        <Box w={'100%'} style={{ padding: 8 }}>
          <Title>Status :</Title>

          {/* Status label */}
          {isLoading ? (
            <Progress color="violet" value={100} animated />
          ) : (
            <Text>
              {gelatoTaskInfo &&
                getGelatoTaskStatusLabel(gelatoTaskInfo.taskState)}
            </Text>
          )}
        </Box>

        <Box w={'100%'} style={{ padding: 8 }}>
          <Title>Transaction: </Title>

          {/* Transaction hash */}
          {isLoading ? (
            <Progress color="violet" value={100} animated />
          ) : (
            <>
              {transactionHash.length > 0 && (
                <Anchor
                  href={`https://polygonscan.com/tx/${transactionHash}`}
                  target="_blank"
                >
                  {shortenWalletAddress(transactionHash)}
                </Anchor>
              )}

              {/* Task extra info */}
              {gelatoTaskInfo?.lastCheckMessage && (
                <Text>{gelatoTaskInfo.lastCheckMessage}</Text>
              )}
            </>
          )}
        </Box>
      </Stack>
    </>
  );
};

const getGelatoTaskStatusLabel = (
  taskStatus: TransactionStatusResponse['taskState'],
) => {
  const label: Record<TransactionStatusResponse['taskState'], string> = {
    CheckPending: 'Pending',
    WaitingForConfirmation: 'Waiting confirmations',
    ExecPending: 'Executing',
    ExecSuccess: 'Success',
    Cancelled: 'Cancelled',
    ExecReverted: 'Reverted',
    Blacklisted: 'Blacklisted',
    NotFound: 'Not Found',
  };

  return label[taskStatus];
};

export default GelatoTaskStatusLabel;
