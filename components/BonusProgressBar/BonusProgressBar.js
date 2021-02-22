import { ethers } from 'ethers';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { DATA_UNAVAILABLE } from '../../config';
import { useLSWStats } from '../../hooks';

const BonusProgressBar = () => {
  const { t } = useTranslation('home');

  const [bonus, setBonus] = useState(DATA_UNAVAILABLE);
  const lwfStats = useLSWStats();
  console.log(lwfStats.data.currentReferralBonus)

  useEffect(() => {
    if (lwfStats.data.currentTimeBonus !== DATA_UNAVAILABLE) {
      setBonus(lwfStats.data.currentTimeBonus + lwfStats.data.currentReferralBonus);
    }
  }, [lwfStats]);

  if (bonus === DATA_UNAVAILABLE) {
    return <></>;
  }

  const renderReferral = () => {
    if (lwfStats.data.refCode > 0) {
      return <>
        <div className="text-xs font-bold text-greenText mt-1">You are also getting a bonus of 10% for being referred by</div>
        <div className="text-xs font-bold text-greenText">Referral ID: {lwfStats.data.refCode}</div>
      </>
    }

    if (lwfStats.data.refAddress !== ethers.constants.AddressZero) {
      return <>
        <div className="text-xs font-bold text-greenText mt-1">You are also getting a bonus of 10% for being referred by</div>
        <div className="text-xs font-bold text-greenText">Referral Address: {lwfStats.data.refAddress}</div>
      </>
    }
  }

  return (
    <div className="m-auto text-center">
      <div>
        <div className="w-full bg-green-100 min-h-12 border border-green-500 p-1">
          <div
            className="bg-green bg-green-400 leading-none h-12"
            style={{ width: `${(bonus / lwfStats.data.maxBonus) * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xs font-thin text-greenText font-bold">{t('contributionBonus', { bonus: (bonus * 100).toFixed(0) })}</div>
        <div className="mt-2">{renderReferral()}</div>
      </div>
    </div>
  );
};

export default BonusProgressBar;
