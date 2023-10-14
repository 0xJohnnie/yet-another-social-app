declare namespace NodeJS {
  export interface ProcessEnv {
    VERCEL_URL: string;
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
  }
}
