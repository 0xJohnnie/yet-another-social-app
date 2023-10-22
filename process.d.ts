declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
    NEXT_PUBLIC_VERCEL_URL: string;

    NEXT_PUBLIC_TIME_ZONE: string;

    NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID_MAINNET: string;
    NEXT_PUBLIC_CHAIN_ID: string;
    NEXT_PUBLIC_RPC_URL_POLYGON: string;
    NEXT_PUBLIC_BLOCK_EXPLORER: string;
    NEXT_PUBLIC_TX_SERVICE_URL_POLYGON: string;
    NEXT_PUBLIC_MAX_GAS_FEE: string;

    DEPLOYER_KEY: string;
    ALCHEMY_API_KEY_POLYGON: string;
    NEXT_PUBLIC_GELATO_RELAY_KEY: string;
  }
}
