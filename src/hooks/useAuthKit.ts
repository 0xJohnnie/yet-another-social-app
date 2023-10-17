import { ExternalProvider } from '@ethersproject/providers';
import { Web3AuthModalPack } from '@safe-global/auth-kit';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useEffect, useState } from 'react';

import { AppConfig } from '@/utils/AppConfig';

interface IuseAuthKit {
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  isLoadingWeb3Auth: boolean;
  isAuthenticated: boolean;
  web3Provider: ExternalProvider | undefined;
  web3Auth: Web3AuthModalPack | undefined;
  ownerAddress: string;
  safes: string[];
  safeSelected: string;
}

const useAuthKit = (): IuseAuthKit => {
  const [isLoadingWeb3Auth, setIsLoadingWeb3Auth] = useState<boolean>(true);

  const [web3Auth, setWeb3Auth] = useState<Web3AuthModalPack>();
  const [web3Provider, setWeb3Provider] = useState<ExternalProvider>();

  const [safes, setSafes] = useState<string[]>([]);
  const [safeSelected, setSafeSelected] = useState<string>('');

  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const isAuthenticated = !!ownerAddress;

  useEffect(() => {
    const init = async () => {
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID_MAINNET,
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
          showOnModal: true,
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
          label: 'wallet_connect',
          showOnModal: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'none',
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'YASA',
          },
        },
      });

      const Web3AuthModal = new Web3AuthModalPack({
        txServiceUrl: process.env.NEXT_PUBLIC_TX_SERVICE_URL_POLYGON,
      });

      await Web3AuthModal.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

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
      setWeb3Auth(Web3AuthModal);
      setIsLoadingWeb3Auth(false);
    };

    if (!web3Auth) {
      init();
    }
  }, [web3Auth]);

  const loginWeb3Auth = async () => {
    if (!web3Auth) {
      return;
    }

    try {
      const { safes, eoa } = await web3Auth.signIn();
      const provider = web3Auth.getProvider() as ExternalProvider;

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
    if (!web3Auth) {
      return;
    }

    try {
      web3Auth?.signOut();
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
    web3Auth,
    ownerAddress,
    safes,
    safeSelected,
  };
};

export default useAuthKit;
