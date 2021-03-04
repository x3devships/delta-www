import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import { ConnectWalletButton } from '../Buttons';

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
          {t('limitedStakingFirstPart')} <br /> Window is now closed!
        </div>
        {connectWalletVisible && (
          <ConnectWalletButton onWalletConnect={onWalletConnect} />
        )}
      </div>
    </div>
  );
};

export default hero;
