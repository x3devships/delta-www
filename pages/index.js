import { useState } from 'react';
import { useWallet } from 'use-wallet';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Staking } from '../components/Staking';
import { LimitedWindow } from '../components/LimitedWindow';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';
import { ConnectionModal } from '../components/Modal';

export default function Main() {
  const wallet = useWallet();
  const [isWalletConnectModalOpen, setIsModalOpen] = useState(false);

  const closeWalletConnectModal = () => {
    setIsModalOpen(false);
  };

  const onWalletConnect = async () => {
    if (!wallet.account) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
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
          site_name: 'DELTA'
        }}
        twitter={{
          handle: '@Delta_Token',
          site: '@Delta_Token',
          cardType: 'summary_large_image'
        }}
      />
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/android-chrome-192x192.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="w-full flex justify-center flex-col bg-backgroundWebsite">
        <Header onWalletConnect={onWalletConnect} />

        <div className="w-full flex flex-col max-w-6xl self-center">
          {' '}
          <Hero onWalletConnect={onWalletConnect} />
          <Staking onWalletConnect={onWalletConnect} />
          <ReferralProgram onWalletConnect={onWalletConnect} />
          <LimitedWindow />
          <Community />
          <ConnectionModal isModalOpen={isWalletConnectModalOpen} closeModal={closeWalletConnectModal} />
        </div>
      </div>
    </>
  );
}
