// import { useI18n } from 'next-rosetta';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import TransactionButton from '../components/Button/TransactionButton';
import { ModalContext } from '../contexts';
import Countdown from 'react-countdown';
import logo from "../public/Delta_Logo_Black.svg"
import {NextSeo} from "next-seo"
export default function Home() {
  const modalContext = useContext(ModalContext);
  const { locale, locales, route } = useRouter();
  // const i18n = useI18n();
  // const { t } = i18n;

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
      <NextSeo
      title="DELTA Financial"
      description="Deep DeFi Derivatives."
      canonical="https://www.delta.financial/"
      openGraph={{
        url: 'https://www.delta.financial/',
        title: 'DELTA Financial',
        description: 'Deep DeFi Derivatives.',
        // images: [
        //   {
        //     url: 'https://www.example.ie/og-image-01.jpg',
        //     width: 800,
        //     height: 600,
        //     alt: 'Og Image Alt',
        //   },
        //   {
        //     url: 'https://www.example.ie/og-image-02.jpg',
        //     width: 900,
        //     height: 800,
        //     alt: 'Og Image Alt Second',
        //   },
        //   { url: 'https://www.example.ie/og-image-03.jpg' },
        //   { url: 'https://www.example.ie/og-image-04.jpg' },
        // ],
        site_name: 'DELTA',
      }}
      twitter={{
        handle: '@Delta_Token',
        site: '@Delta_Token',
        cardType: 'summary_large_image',
      }}
    />
      <main>

 
      <div className="flex justify-center flex-col items-center h-screen">
                <img src={logo} height="300" width="300" />

             <Countdown date={1612920799000 + (8*day) + (4 * hour)} />

             <a href="https://medium.com/@0xdec4f/introducing-delta-financial-b23952e9127c" target="_blank" className="text-sm pt-10">more</a>
      </div>
      </main>
    </div>
  );
}

export const getStaticProps = async context => {
  const table = {}
  return { props: { table } }; // Passed to `/pages/_app.tsx`
};
