import { ethers } from 'ethers';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { DATA_UNAVAILABLE } from '../../config';

const BonusProgressBar = ({ lswStats }) => {
  const { t } = useTranslation('home');

  const [bonus, setBonus] = useState(DATA_UNAVAILABLE);

  useEffect(() => {
    if (lswStats.data.currentTimeBonus !== DATA_UNAVAILABLE) {
      setBonus(lswStats.data.currentTimeBonus + lswStats.data.currentReferralBonus);
    }
  }, [lswStats]);

  if (bonus === DATA_UNAVAILABLE) {
    return <></>;
  }

  const renderReferral = () => {
    if (lswStats.data.refCode > 0) {
      return <>
        <div className="text-xs font-bold text-greenText mt-1">This includes a bonus of 10% for being referred by</div>
        <div className="text-xs font-bold text-greenText">Referral ID: {lswStats.data.refCode}</div>
      </>
    }

    if (lswStats.data.refAddress !== ethers.constants.AddressZero) {
      return <>
        <div className="text-xs font-bold text-greenText mt-1">This includes a bonus of 10% for being referred by</div>
        <div className="text-xs font-bold text-greenText">Referral Address: {lswStats.data.refAddress}</div>
      </>
    }
  }

  return (
    <div className="m-auto text-center">
      <div>
        <div className="w-full bg-green-100 min-h-12 border border-green-500 p-1">
          <div
            className="bg-green bg-green-400 leading-none h-12"
            style={{ width: `${(bonus / lswStats.data.maxBonus) * 100}%` }}
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
