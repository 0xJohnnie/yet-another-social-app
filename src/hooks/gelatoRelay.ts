import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import { GelatoRelayPack } from '@safe-global/relay-kit';
import {
  MetaTransactionData,
  MetaTransactionOptions,
} from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';

const gelatoRelay = async (
  txData: MetaTransactionData[],
  safeAddress: string,
  web3Provider: ethers.providers.Web3Provider,
) => {
  console.error(' gelatoRelay : START');

  try {
    const ownerSigner = web3Provider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: ownerSigner,
    });

    const options: MetaTransactionOptions = {
      isSponsored: true,
      gasLimit: '600000',
      //  gasToken: ethers.constants.AddressZero // native token
    };

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    const relayKit = new GelatoRelayPack(
      process.env.NEXT_PUBLIC_GELATO_RELAY_KEY,
    );

    const safeTransaction = await relayKit.createRelayedTransaction({
      safe: safeSDK,
      transactions: txData,
      options,
    });

    const signedSafeTransaction =
      await safeSDK.signTransaction(safeTransaction);

    const response = await relayKit.executeRelayTransaction(
      signedSafeTransaction,
      safeSDK,
      options,
    );

    console.debug(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`,
    );

    console.error(' gelatoRelay : END');
    return {
      gelatoTaskId: response.taskId ?? '',
    };
  } catch (error) {
    console.log('gelatoRelay error:', error);

    return {
      gelatoTaskId: '',
    };
  }
};

export default gelatoRelay;
