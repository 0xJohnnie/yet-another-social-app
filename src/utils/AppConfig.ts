import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const AppConfig = {
  site_name: 'YASA',
  title: 'YASA - A cross-chain social dApp that supports Account Abstraction',
  title_template: '%s - by 0xJohnnie',
  site:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : 'http://localhost:3000',

  description:
    'YASA - A cross-chain social dApp that supports Account Abstraction',
  author: { name: '0xJohnnie', site: 'https://linktr.ee/0xJohnnie' },
  locale: 'en',
  version: `${dayjs
    .tz(dayjs(), process.env.NEXT_PUBLIC_TIME_ZONE)
    .format('YYYY-MM-DD @ HH:mm:ss')
    .toString()} ${
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.slice(0, 6) ?? ''
  }`.trim(),
};

export default AppConfig;
