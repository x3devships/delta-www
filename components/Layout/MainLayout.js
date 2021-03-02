import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { Community } from '../Community';
import { NavBar } from '../NavBar';

const MainLayout = ({ children }) => {
  return <>
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
      <link
        rel="preload"
        href="/fonts/Wulkan/Wulkan-Display-Medium.woff"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/Wulkan/Wulkan-Display-Medium.woff"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/GT-America/GT-America-Standard-Regular.woff"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/GT-America/GT-America-Standard-Regular.woff2"
        as="font"
        crossOrigin=""
      />
    </Head>
    <NavBar />
    <div className="w-full flex justify-center flex-col">
      <div className="w-full flex flex-col max-w-6xl self-center p-2 md:p-6">
        {children}
        <Community />
      </div>
    </div>
  </>;
};

export default MainLayout;