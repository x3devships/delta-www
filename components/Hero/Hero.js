import useTranslation from 'next-translate/useTranslation';
import { Button } from '@windmill/react-ui';
import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import plus from '../../public/plus.svg';

const hero = ({ onWalletConnect }) => {
  const { t } = useTranslation('home');
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);

  useEffect(() => {
    console.log(wallet.error);
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  return (
    <div className="pt-10 pb-20">
      <div className="px-3 lg:2/6 xl:w-3/4 mt-20 ">
        <div className="text-6xl font-semibold text-gray-900 leading-none font-wulkan">
          {t('limitedStakingFirstPart')} <br /> {t('limitedStakingSecondPart')}
        </div>
        <div className="mt-6 text-xl xl:w-2/4 text-true-gray-500 antialiased font-wulkan sm:w-full" dangerouslySetInnerHTML={{ __html: t('deltaLSW') }} />
        {connectWalletVisible && (
          <Button
            onClick={() => onWalletConnect()}
            className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
            style={{
              marginRight: '1px',
              borderRadius: '0px',
              backgroundColor: 'black',
              padding: '1rem',
              marginTop: '1rem'
            }}
          >
            <span>{connectWalletVisible ? <>{t('connectWallet')}</> : <></>}</span>
            <img alt="+" src={plus} className="m-auto pl-8" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default hero;
