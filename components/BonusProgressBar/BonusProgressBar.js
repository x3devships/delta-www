import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { DATA_UNAVAILABLE } from '../../config';
import { useLSWStats } from '../../hooks';

const BonusProgressBar = () => {
  const { t } = useTranslation('home');

  const [bonus, setBonus] = useState(DATA_UNAVAILABLE);
  const lwfStats = useLSWStats();

  useEffect(() => {
    if (lwfStats.data.currentTimeBonus !== DATA_UNAVAILABLE) {
      setBonus(lwfStats.data.currentTimeBonus + lwfStats.data.currentReferralBonus);
    }
  }, [lwfStats]);

  if (bonus === DATA_UNAVAILABLE) {
    return <></>;
  }

  return (
    <div className="m-auto w-11/12 text-center">
      <div>
        <div className="w-full bg-backgroundLightPurple h-16 w-32">
          <div
            className="bg-backgroundLightPurple bg-gradient-to-r from-gradiantGreen to-gradiantLightGreen leading-none py-1 h-16 w-32"
            style={{ width: `${(bonus / lwfStats.data.maxBonus) * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xs font-thin text-greenText font-bold">{t('contributionBonus', { bonus: (bonus * 100).toFixed(0) })}</div>
        {lwfStats.data.refCode > 0 && <>
          <div className="text-xs font-bold text-greenText mt-1">You are getting a bonus of 10% for being referred by:</div>
          <div className="text-xs font-bold text-greenText">(Referral ID: {lwfStats.data.refCode})</div>
        </>}
      </div>
    </div>
  );
};

export default BonusProgressBar;
