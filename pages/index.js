import { useI18n } from 'next-rosetta';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import TransactionButton from '../components/Button/TransactionButton';
import { ModalContext } from '../contexts';
import Countdown from 'react-countdown';
import logo from "../public/Delta_Logo_Black.svg"
export default function Home() {
  const modalContext = useContext(ModalContext);
  const { locale, locales, route } = useRouter();
  const i18n = useI18n();
  const { t } = i18n;

  const onTransaction = async () => {
    if (await modalContext.showConfirm('Confirmation', 'Please confirm you are there')) {
      await modalContext.showError('Error', 'Example error message');
    }
  };

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;


  return (
    <div>
      <Head>
        DELTA
      </Head>
      <main>

 
      <div className="flex justify-center flex-col items-center h-screen">
                <img src={logo} height="300" width="300" />

             <Countdown date={1612920799000 + (7*day) + (4 * hour)} />

             <a href="https://medium.com/@0xdec4f/introducing-delta-financial-b23952e9127c" target="_blank" className="text-sm pt-10">more</a>
      </div>
      </main>
    </div>
  );
}

export const getStaticProps = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../i18n/${locale}`); // Import locale
  return { props: { table } }; // Passed to `/pages/_app.tsx`
};
