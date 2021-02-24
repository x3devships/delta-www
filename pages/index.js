import { useState } from 'react';
import { useWallet } from 'use-wallet';
import { Hero } from '../components/Hero';
import { Staking } from '../components/Staking';
import { LimitedWindow } from '../components/LimitedWindow';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';
import { ConnectionModal } from '../components/Modal';
import { useLSWStats } from '../hooks';
import { MainLayout } from '../components/Layout';

export default function Main() {
  const wallet = useWallet();
  const [isWalletConnectModalOpen, setIsModalOpen] = useState(false);

  const lswStats = useLSWStats();

  const closeWalletConnectModal = () => {
    setIsModalOpen(false);
  };

  const onWalletConnect = async () => {
    if (!wallet.account) {
      setIsModalOpen(true);
    }
  };

  return <MainLayout onWalletConnect={onWalletConnect}>
    <Hero onWalletConnect={onWalletConnect} />
    <Staking onWalletConnect={onWalletConnect} lswStats={lswStats} />
    <ReferralProgram onWalletConnect={onWalletConnect} lswStats={lswStats} />
    <LimitedWindow />
    <Community />
    <ConnectionModal isModalOpen={isWalletConnectModalOpen} closeModal={closeWalletConnectModal} />
  </MainLayout>;
}
