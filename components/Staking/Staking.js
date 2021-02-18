import { useEffect, useState } from 'react';
import { Button, Input } from '@windmill/react-ui';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { useYam } from '../../hooks';
import { ProgressBarCountDown } from '../ProgressBarCountDown';
import { ProgressBar } from '../ProgressBar';
import { TransactionButton } from '../Button';
import plus from '../../public/plus.svg';
import chevron from '../../public/chevron.svg';

const Staking = ({ onWalletConnect }) => {
  const { t } = useTranslation('home');
  const yam = useYam();
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);
  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0">
                <div className="m-auto h-80 border-black border-2 border-b">
                  <div className="flex">
                    <div className="m-auto w-10/12 text-4xl py-9 font-wulkan">{t('limitedStaking')}</div>
                    <img src={chevron} alt="chevron" className="m-auto" />
                  </div>
                  <ProgressBarCountDown />
                </div>
                <div className="h-4/6 border-2 pt-2 border-black border-t-0">
                  <div className="m-auto w-11/12 text-4xl py-9 font-wulkan">{t('limitedStaking')}</div>
                  <div className="flex space-x-80 sm:flex-wrap sm:space-x-0">
                    <iframe
                      className="mb-9 pl-9 sm:pl-0"
                      src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                      width="720"
                      height="391"
                    />
                    <iframe
                      className="mb-9 pl-9 sm:pl-0"
                      src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                      width="720"
                      height="391"
                    />
                  </div>
                </div>
                <div className="flex h-128 border-2 pt-2 border-black border-t-0 pl-9 sm:block sm:pb-5 sm:pl-2">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9 sm:pl-0">
                    <div className="text-4xl pb-4 font-wulkan">{t('bonus')}</div>
                    <div className="pb-2 font-gt_americare" dangerouslySetInnerHTML={{ __html: t('earnWithDelta') }} />
                    <div>
                      {connectWalletVisible ? (
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
                          <span>{t('connectWallet')}</span>
                          <img src={plus} className="m-auto pl-8" />
                        </Button>
                      ) : (
                        <div className="flex w-6/12">
                          <Input style={{ border: '1px solid black', marginRight: '5px', marginTop: '15px' }} />
                          <TransactionButton text="Approve" secondaryLooks />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pr-9 pt-9">
                    <ProgressBar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Staking;
