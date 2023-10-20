'use client';

import detectEthereumProvider from '@metamask/detect-provider';
import {
  Web3AuthEventListener,
  Web3AuthModalPack,
} from '@safe-global/auth-kit';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { AppConfig } from '@/utils/AppConfig';

import { deploySafe } from './deploySafe';

interface IuseAuthKit {
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  setSafes: (safeAdd: string[]) => void;
  isLoadingWeb3Auth: boolean;
  isAuthenticated: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  web3AuthPack: Web3AuthModalPack | undefined;
  ownerAddress: string;
  safes: string[];
  safeSelected: string;
  isDeployingSafe: boolean;
}

const connectedHandler: Web3AuthEventListener = (data) =>
  console.log('CONNECTED', data);
const disconnectedHandler: Web3AuthEventListener = (data) =>
  console.log('DISCONNECTED', data);

const useAuthKit = (): IuseAuthKit => {
  const [isLoadingWeb3Auth, setIsLoadingWeb3Auth] = useState<boolean>(true);

  const [isDeployingSafe, setIsDeployingSafe] = useState<boolean>(false);

  const [web3AuthPack, setWeb3AuthPack] = useState<Web3AuthModalPack>();
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const [safes, setSafes] = useState<string[]>([]);
  const [safeSelected, setSafeSelected] = useState<string>('');

  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const isAuthenticated = !!ownerAddress;

  useEffect(() => {
    const init = async () => {
      const providerExist = (await detectEthereumProvider()) as boolean;
      const showAdapter = providerExist && !isMobile;

      const web3auth = new Web3AuthModalPack({
        txServiceUrl: process.env.NEXT_PUBLIC_TX_SERVICE_URL_POLYGON,
      });

      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID_MAINNET,
        web3AuthNetwork: 'mainnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_URL_POLYGON,
        },
        uiConfig: {
          appName: AppConfig.site_name,
          theme: 'dark',
          loginMethodsOrder: [
            'google',
            'twitter',
            'discord',
            'twitch',
            'reddit',
            'github',
            'linkedin',
          ],
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnModal: showAdapter,
          showOnMobile: showAdapter,
          showOnDesktop: true,
        },
        [WALLET_ADAPTERS.OPENLOGIN]: {
          label: 'openlogin',
          loginMethods: {
            sms_passwordless: {
              name: 'sms_passwordless',
              showOnModal: false,
            },
          },
        },
        [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
          label: 'wallet_connect_V1',
          showOnMobile: false,
          showOnDesktop: false,
          showOnModal: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'none',
        },
        adapterSettings: {
          clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID_MAINNET,
          network: 'mainnet',
          uxMode: 'popup',
          whiteLabel: {
            name: 'YASA',
          },
        },
      });

      await web3auth.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      web3auth.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3auth.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      if (web3auth.getProvider()) {
        const { safes, eoa } = await web3auth.signIn();
        const provider =
          web3auth.getProvider() as ethers.providers.ExternalProvider;

        console.log('useAuthKit  eoa', eoa);
        console.dir('useAuthKit safes', safes);

        if (safes && safes.length > 0) {
          setSafes(safes || []);
          setSafeSelected(safes[0]);
        }

        setOwnerAddress(eoa);
        setWeb3Provider(new ethers.providers.Web3Provider(provider));
      }
      setWeb3AuthPack(web3auth);
      setIsLoadingWeb3Auth(false);
    };

    init();
  }, []);

  const loginWeb3Auth = async () => {
    if (!web3AuthPack) {
      return;
    }

    try {
      const { safes, eoa } = await web3AuthPack.signIn();
      const provider =
        web3AuthPack.getProvider() as ethers.providers.ExternalProvider;

      console.log('useAuthKit  eoa', eoa);
      console.dir('useAuthKit safes', safes);

      setOwnerAddress(eoa);
      setSafes(safes || []);
      setSafeSelected(safes && safes?.length > 0 ? safes[0] : '');
      setWeb3Provider(new ethers.providers.Web3Provider(provider));

      if (safes && safes.length === 0) {
        setIsDeployingSafe(true);

        const safeAddress = await deploySafe(eoa);

        safeAddress.length > 1 && setSafes([...safes, safeAddress]);
        setSafeSelected(safeAddress);
        setIsDeployingSafe(false);
      }
    } catch (error) {
      console.log('loginWeb3Auth error: ', error);
    }
  };

  const logoutWeb3Auth = () => {
    if (!web3AuthPack) {
      return;
    }

    try {
      web3AuthPack?.signOut();
      setOwnerAddress('');
      setSafes([]);
      setSafeSelected('');
      setWeb3Provider(undefined);

      setIsLoadingWeb3Auth(true);

      setTimeout(() => {
        setIsLoadingWeb3Auth(false);
      }, 300);
    } catch (error) {
      console.log('logoutWeb3Auth error:', error);
    }
  };

  return {
    loginWeb3Auth,
    logoutWeb3Auth,
    isLoadingWeb3Auth,
    isAuthenticated,
    web3Provider,
    web3AuthPack,
    ownerAddress,
    safes,
    setSafes,
    safeSelected,
    isDeployingSafe,
  };
};

export default useAuthKit;
