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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { isMobile } from 'react-device-detect';

import AppConfig from '@/utils/AppConfig';

import deploySafe from './deploySafe';

interface AuthKitContextProps {
  isLoadingWeb3Auth: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  ownerAddress: string;

  setSafeAddress: React.Dispatch<React.SetStateAction<string>>;
  safes: string[];
  safeAddress: string;
  isDeployingSafe: boolean;

  isAuthenticated: boolean;
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;

  isRelayerLoading: boolean;
  relayTransaction: () => Promise<void>;
  gelatoTaskId?: string;
}

const initialState = {
  isLoadingWeb3Auth: false,
  ownerAddress: '',

  setSafeAddress: () => {},
  safes: [],
  safeAddress: '',
  isDeployingSafe: false,

  isAuthenticated: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},

  isRelayerLoading: true,
  relayTransaction: async () => {},
};

const authKitContext = createContext<AuthKitContextProps>(initialState);

const useAuthKit = () => {
  const context = useContext(authKitContext);

  if (!context) {
    throw new Error('authKitContext should be used within a AuthKit Provider');
  }
  return context;
};

const AuthKitProvider = ({ children }: { children: any }) => {
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();
  const [web3AuthKit, setWeb3AuthKit] = useState<Web3AuthModalPack>();

  const [ownerAddress, setOwnerAddress] = useState<string>('');

  const [safes, setSafes] = useState<string[]>([]);
  const [safeAddress, setSafeAddress] = useState<string>('');

  const isAuthenticated = !!ownerAddress;

  const [isLoadingWeb3Auth, setIsLoadingWeb3Auth] = useState<boolean>(true);

  const [isDeployingSafe, setIsDeployingSafe] = useState<boolean>(false);

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  const connectedHandler: Web3AuthEventListener = (data) =>
    console.log('CONNECTED', data);

  const disconnectedHandler: Web3AuthEventListener = (data) =>
    console.log('DISCONNECTED', data);

  useEffect(() => {
    (async () => {
      setIsLoadingWeb3Auth(true);

      const providerExist = (await detectEthereumProvider()) as boolean;
      const showAdapter = providerExist && !isMobile;

      const web3authPack = new Web3AuthModalPack({
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

      await web3authPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      setWeb3AuthKit(web3authPack);

      web3authPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3authPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      setIsLoadingWeb3Auth(false);
    })();
  }, []);

  const loginWeb3Auth = useCallback(async () => {
    if (!web3AuthKit) {
      return;
    }

    console.error(' loginWeb3Auth : START');
    try {
      const { safes, eoa } = await web3AuthKit.signIn();
      const provider =
        web3AuthKit.getProvider() as ethers.providers.ExternalProvider;

      console.warn('useAuthKit  eoa', eoa);
      console.warn('useAuthKit safes', safes);

      setOwnerAddress(eoa);
      setSafes(safes || []);
      setSafeAddress(safes && safes?.length > 0 ? safes[0] : '');
      setWeb3Provider(new ethers.providers.Web3Provider(provider));

      if (safes && safes.length === 0) {
        setIsDeployingSafe(true);

        console.warn('useAuthKit setIsDeployingSafe : START');

        const safeAddress = await deploySafe(eoa);

        console.warn('useAuthKit setIsDeployingSafe : END');

        safeAddress.length > 1 && setSafes([...safes, safeAddress]);
        setSafeAddress(safeAddress);
        setIsDeployingSafe(false);

        console.warn('setIsDeployingSafe DONE eoa', eoa);
        console.warn('setIsDeployingSafe DONE safes', safes);
      }
    } catch (error) {
      console.log('loginWeb3Auth error: ', error);
    }

    console.error(' loginWeb3Auth : END');
  }, [web3AuthKit]);

  useEffect(() => {
    if (web3AuthKit && web3AuthKit.getProvider()) {
      (async () => {
        await loginWeb3Auth();
      })();
    }
  }, [web3AuthKit, loginWeb3Auth]);

  const logoutWeb3Auth = () => {
    if (!web3AuthKit) {
      return;
    }

    try {
      web3AuthKit.signOut();

      setWeb3Provider(undefined);
      setOwnerAddress('');
      setSafes([]);
      setSafeAddress('');
      setIsLoadingWeb3Auth(true);

      setTimeout(() => {
        setIsLoadingWeb3Auth(false);
      }, 300);
    } catch (error) {
      console.log('logoutWeb3Auth error:', error);
    }
  };

  const relayTransaction = async () => {};

  const state = {
    isLoadingWeb3Auth,
    web3Provider,

    isAuthenticated,
    loginWeb3Auth,
    logoutWeb3Auth,

    ownerAddress,
    safeAddress,

    setSafeAddress,
    safes,
    isDeployingSafe,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,
  };

  return (
    <authKitContext.Provider value={state}>{children}</authKitContext.Provider>
  );
};

export { useAuthKit, AuthKitProvider };
