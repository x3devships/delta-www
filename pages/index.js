import { useState } from 'react';
import { useWallet } from 'use-wallet';
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
    <div className="w-full">
      <Header onWalletConnect={onWalletConnect} />
      <Hero />
      {/* <Staking /> */}

      <ReferralProgram />
      <LimitedWindow />
      <Community />
      <ConnectionModal isModalOpen={isWalletConnectModalOpen} closeModal={closeWalletConnectModal} />
    </div>
  );
}
