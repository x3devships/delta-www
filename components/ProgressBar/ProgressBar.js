import useTranslation from 'next-translate/useTranslation';

const ProgressBarCountDown = () => {
  const { t } = useTranslation('home');
  return (
    <div className="m-auto w-11/12 text-center">
      <div>
        <div className="w-full bg-backgroundLightPurple h-16 w-32">
          <div
            className="bg-backgroundLightPurple bg-gradient-to-r from-gradiantGreen to-gradiantLightGreen leading-none py-1 h-16 w-32"
            style={{ width: '85%' }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xs font-thin text-greenText">{t('eligibility')}</div>
        <div className="text-xs font-thin text-greenText">{t('contributionBonus')}</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
