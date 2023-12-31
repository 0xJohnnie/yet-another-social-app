'use server';

import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ethers } from 'ethers';

dayjs.extend(utc);
dayjs.extend(timezone);

const deploySafe = async (ownerAddress: string): Promise<string> => {
  console.error('\n\nSTART deploySafe\n\n');

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL_POLYGON,
    );

    const deployerSigner = new ethers.Wallet(
      process.env.DEPLOYER_KEY,
      provider,
    );

    const deployerAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: deployerSigner,
    });

    const safeAccConfig: SafeAccountConfig = {
      owners: [ownerAddress],
      threshold: 1,
    };

    const sf = await SafeFactory.create({
      ethAdapter: deployerAdapter,
    });

    console.log(
      dayjs
        .tz(dayjs(), process.env.NEXT_PUBLIC_TIME_ZONE)
        .format('YYYY-MM-DD @ HH:mm:ss')
        .toString(),
      'Safe is getting deployed',
    );

    const safeSdk: Safe = await sf.deploySafe({
      safeAccountConfig: safeAccConfig,

      options: {
        maxFeePerGas: process.env.NEXT_PUBLIC_MAX_GAS_FEE,
        maxPriorityFeePerGas: process.env.NEXT_PUBLIC_MAX_GAS_FEE,
      },
    });

    console.log(
      dayjs
        .tz(dayjs(), process.env.NEXT_PUBLIC_TIME_ZONE)
        .format('YYYY-MM-DD @ HH:mm:ss')
        .toString(),
      'Safe has been deployed',
    );

    const safeAdd = await safeSdk.getAddress();
    /* 

    const privateSigner = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);
    
    const faucetAmount = ethers.utils.parseUnits('0.001', 'ether').toString();

    const tx = await privateSigner.sendTransaction({
      to: safeAdd,
      data: '0x',
      value: faucetAmount,
    });

    console.log('Sent! 🎉');
    console.log(`TX hash: ${tx.hash}`); 
    */

    console.warn('deployer address ', await deployerSigner.getAddress());
    console.warn('owner address', ownerAddress);
    console.warn('safe address', safeAdd);

    console.error(
      `Owner Address https://polygonscan.com/address/${ownerAddress}`,
    );
    console.error(`Safe Address https://polygonscan.com/address/${safeAdd}`);
    console.error(
      `Safe UI https://app.safe.global/settings/setup?safe=matic:${safeAdd}`,
    );

    console.error('\n\nEND deploySafe\n\n');

    return safeAdd;
  } catch (error) {
    console.log('deploySafe error: ', error);
    return '';
  }
};

export default deploySafe;
