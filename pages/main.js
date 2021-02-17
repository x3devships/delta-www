import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Staking } from '../components/Staking';
import { LimitedWindow } from '../components/LimitedWindow';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';

export default function Main() {
  return (
    <div className="w-full">
      <Header />
      <Hero />
      <Staking />
      <LimitedWindow />
      <Community />
      <ReferralProgram />
    </div>
  );
}
