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
  const [isModalOpen, setIsModalOpen] = useState(wallet.status !== 'connected');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <Header />
      <Hero />
      <Staking />
      <LimitedWindow />
      <Community />
      <ReferralProgram />
      <ConnectionModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
