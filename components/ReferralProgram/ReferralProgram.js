import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import useCopy from '@react-hook/copy';
import chevron from '../../public/chevron.svg';
import { useYam } from '../../hooks';
import useLSWReferralCode from '../../hooks/useLSWReferralCode';
import { DATA_UNAVAILABLE } from '../../config';
import github from '../../public/Github.svg';
import { ConnectionButton } from '../ConnectionButton';
import { TransactionButton } from '../Button';

const ReferralProgram = ({ onWalletConnect }) => {
  const yam = useYam();
  const wallet = useWallet();
  const lswRefCode = useLSWReferralCode();
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation('home');
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);

  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  const onGenerateCode = async () => {
    if (yam && wallet.account) {
      const transaction = yam.contracts.LSW.methods.makeRefCode();

      try {
        setGenerating(true);
        const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account });

        await transaction.send({
          from: wallet.account,
          gas: transactionGasEstimate
        });

        // await new Promise(r => setTimeout(r, 4000));
        setGenerating(false);
      } catch (error) {
        alert(error.message);
        console.log(error);
        setGenerating(false);
      }
    }
  };

  const { copied, copy, reset } = useCopy(`https://delta.financial/join/${lswRefCode.referralId}`);

  useEffect(() => {
    setTimeout(reset, 1500);
  }, [copied]);

  function getCopyForButton() {
    if (generating) {
      return 'GENERATING LINK...';
    }
    if (!wallet.account) {
      return 'CONNECT WALLET TO GENERATE REFERRAL LINK';
    }
    return 'GENERATE REFERRAL LINK';
  }

  const renderGenerateLinkButton = () => {
    if (lswRefCode.referralId !== DATA_UNAVAILABLE) {
      return (
        <div className="bg-black shadow-xl p-4 mt-4 inline-block text-white font-mono sm:mr-2.5">
          <div dangerouslySetInnerHTML={{ __html: t('referral') }} />
          <div onClick={copy} className="bg-backgroundPage shadow-xl p-4 mt-4 inline-block text-black flex font-mono">
            <span>{copied ? `Copied !` : `delta.financial/join/${lswRefCode.referralId}`}</span>
          </div>
        </div>
      );
    }
    return (
      <TransactionButton
        text={getCopyForButton()}
        secondaryLooks
        onClick={() => (wallet.account ? onGenerateCode() : onWalletConnect())}
      />
    );
  };

  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0">
                <div className="flex h-128 border-2 pt-2 border-black pl-9 sm:pl-0">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9 sm:pl-2">
                    <div className="grid grid-cols-2 gap-x-96 sm:block" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <div className="text-4xl pb-4 font-wulkan">{t('48Hours')}</div>
                        <div className="pb-2 font-gt_americare">{t('contracts')}</div>
                        <ConnectionButton
                          url="https://github.com/Delta-Financial/Smart-Contracts/blob/master/Periphery/DELTA_Limited_Staking_Window.sol"
                          text="LSW"
                          image={github}
                        />
                        <ConnectionButton
                          url="https://github.com/Delta-Financial/Smart-Contracts/tree/master/Governance"
                          text="Governance"
                          image={github}
                        />
                        <ConnectionButton
                          url="https://github.com/Delta-Financial/Smart-Contracts/tree/master/Periphery"
                          text="Periphery"
                          image={github}
                        />
                        <br />
                        <hr />
                        <br />
                        <div className="text-4xl pb-4">{t('deltaReferral')} </div>
                        <div className="pb-2 sm:mr-2.5">
                          <div dangerouslySetInnerHTML={{ __html: t('referral') }} />
                        </div>
                        <div>{renderGenerateLinkButton()}</div>
                      </div>
                      {/* 
                      <div className="m-auto w-12/12 text-4xl py-9 pt-0">
                        <div className="grid grid-cols-2">
                          <div>Your Referral Rewards</div>
                          <div>
                            <img src={chevron} alt="chevron" className="m-auto mt-0" />
                          </div>
                        </div>
                        <div className="pr-32">
                          <iframe
                            className="mb-9 pr-9"
                            src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                            width="720"
                            height="391"
                          />
                        </div>
                        <div className="m-auto w-12/12 text-4xl py-9">
                          Your Referral Bonus
                          <ul className="pl-7" style={{ listStyleType: 'disc' }}>
                            <li>Your Referrals: 07</li>
                            <li>Credit earned: 2.8 LP Credit</li>
                            <li>ETH earned: 2.7 ETH</li>
                          </ul>
                        </div>
                      </div>
                      */}
                    </div>
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

export default ReferralProgram;
