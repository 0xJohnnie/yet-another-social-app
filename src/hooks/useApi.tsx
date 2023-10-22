import { useEffect, useState } from 'react';

type apiCallParam<T> = (signal: AbortSignal) => Promise<T>;

type useApiHookReturnValue<T> = {
  isLoading: boolean;
  data?: T;
};

function useApi<T>(
  apiCall: apiCallParam<T>,
  pollingTime: number,
  stopApiCall: boolean,
): useApiHookReturnValue<T> {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>();

  useEffect(() => {
    const abortController = new AbortController();

    async function performApiCall() {
      try {
        setIsLoading(true);
        const data = await apiCall(abortController.signal);
        setData(data);

        if (stopApiCall) {
          console.debug('stopping API call');
          clearInterval(intervalId);
        }
      } catch (exception) {
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    let intervalId: number;

    if (pollingTime) {
      intervalId = setInterval(() => {
        performApiCall();
      }, pollingTime) as unknown as number;
    }

    performApiCall();

    return () => {
      abortController.abort();
      clearInterval(intervalId);
    };
  }, [apiCall, pollingTime, stopApiCall]);

  return {
    isLoading,
    data,
  };
}

export default useApi;
