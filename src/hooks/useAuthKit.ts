import { ExternalProvider } from '@ethersproject/providers';
import {
  Web3AuthEventListener,
  Web3AuthModalPack,
} from '@safe-global/auth-kit';
import { WalletConnectModal } from '@walletconnect/modal';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  MULTI_CHAIN_ADAPTERS,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
import {
  getWalletConnectV2Settings,
  WalletConnectV2Adapter,
} from '@web3auth/wallet-connect-v2-adapter';
import { useEffect, useState } from 'react';

import { AppConfig } from '@/utils/AppConfig';

interface IuseAuthKit {
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  isLoadingWeb3Auth: boolean;
  isAuthenticated: boolean;
  web3Provider: ExternalProvider | undefined;
  web3AuthPack: Web3AuthModalPack | undefined;
  ownerAddress: string;
  safes: string[];
  safeSelected: string;
}

const connectedHandler: Web3AuthEventListener = (data) =>
  console.log('CONNECTED', data);
const disconnectedHandler: Web3AuthEventListener = (data) =>
  console.log('DISCONNECTED', data);

const useAuthKit = (): IuseAuthKit => {
  const [isLoadingWeb3Auth, setIsLoadingWeb3Auth] = useState<boolean>(true);

  const [web3AuthPack, setWeb3AuthPack] = useState<Web3AuthModalPack>();
  const [web3Provider, setWeb3Provider] = useState<ExternalProvider>();

  const [safes, setSafes] = useState<string[]>([]);
  const [safeSelected, setSafeSelected] = useState<string>('');

  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const isAuthenticated = !!ownerAddress;

  useEffect(() => {
    const init = async () => {
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
          showOnDesktop: true,
          showOnMobile: false,
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
          label: 'Walletconnect_V1',
          showOnModal: true,
        },
        [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
          label: 'Walletconnect_V2',
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

      const Web3AuthModal = new Web3AuthModalPack({
        txServiceUrl: process.env.NEXT_PUBLIC_TX_SERVICE_URL_POLYGON,
      });

      const defaultWcSettings = await getWalletConnectV2Settings(
        'eip155',
        [1],
        process.env.NEXT_PUBLIC_WALLET_CONNECT_V2_ID,
      );

      const walletConnectV2Adapter = new WalletConnectV2Adapter({
        adapterSettings: { ...defaultWcSettings.adapterSettings },
        loginSettings: { ...defaultWcSettings.loginSettings },
      });

      const walletConnectV1Adapter = new WalletConnectV1Adapter({
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID_MAINNET,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_URL_POLYGON,
        },
        sessionTime: 3600, // 1 day in seconds
      });

      Web3AuthModal.web3Auth?.configureAdapter(walletConnectV1Adapter);

      await Web3AuthModal.init({
        options,
        adapters: [walletConnectV1Adapter, openloginAdapter],
        modalConfig,
      });

      Web3AuthModal.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);

      Web3AuthModal.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      if (Web3AuthModal.getProvider()) {
        const { safes, eoa } = await Web3AuthModal.signIn();
        const provider = Web3AuthModal.getProvider() as ExternalProvider;

        console.log('useAuthKit  eoa', eoa);
        console.log('useAuthKit safes', safes);

        if (safes && safes.length > 0) {
          setSafes(safes || []);
          setSafeSelected(safes[0]);
        }
        setOwnerAddress(eoa);
        setWeb3Provider(provider);
      }
      setWeb3AuthPack(Web3AuthModal);
      setIsLoadingWeb3Auth(false);
    };

    if (!web3AuthPack) {
      init();
    }
  }, [web3AuthPack]);

  const loginWeb3Auth = async () => {
    if (!web3AuthPack) {
      return;
    }

    try {
      const { safes, eoa } = await web3AuthPack.signIn();
      const provider = web3AuthPack.getProvider() as ExternalProvider;

      console.log('useAuthKit  eoa', eoa);
      console.log('useAuthKit safes', safes);

      setOwnerAddress(eoa);
      setSafes(safes || []);
      setWeb3Provider(provider);
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
      setWeb3Provider(undefined);
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
    safeSelected,
  };
};

export default useAuthKit;
