'use client';

import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  let sw: ServiceWorkerContainer | undefined;

  if (typeof window !== 'undefined') {
    sw = window?.navigator?.serviceWorker;
  }

  useEffect(() => {
    const handler = (e: { preventDefault: () => void }) => {
      e.preventDefault();

      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    //  console.debug('#1 Added beforeinstallprompt event listener');

    return () => {
      window.removeEventListener('transitionend', handler);
      //    console.debug('#2 Removing beforeinstallprompt event listener');
    };
  }, []);

  const isDevEnv = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (sw && !isDevEnv) {
      sw.register('/yasa-nextpwa-service-worker.js', { scope: '/' })
        .then((registration) => {
          console.debug(
            'Service Worker registration successful with scope: ',
            registration.scope,
          );
        })
        .catch((err) => {
          console.debug('Error : Service Worker registration failed.\n\n', err);
        });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sw]);

  if (!supportsPWA) {
    // console.warn('no supportsPWA');
    return null;
  }

  const onClick = (evt: { preventDefault: () => void }) => {
    evt.preventDefault();

    if (!promptInstall) {
      // console.warn('no promptInstall');
      return;
    }

    promptInstall.prompt();
  };

  return (
    <Button
      className="link-button"
      id="setup_button"
      aria-label="Install app"
      title="Install app"
      onClick={onClick}
    >
      Install
    </Button>
  );
};

export default InstallPWA;
