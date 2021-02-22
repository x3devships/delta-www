/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import useCopy from '@react-hook/copy';
import { useYam } from '../../hooks';
import useLSWReferralCode from '../../hooks/useLSWReferralCode';
import { DATA_UNAVAILABLE } from '../../config';
import github from '../../public/Github.svg';
import { FancyButton } from '../Buttons';
import { TransactionButton } from '../Button';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH2 } from '../Title';
import { errors } from '../../helpers';
import { ModalContext } from '../../contexts';

const ReferralProgram = ({ onWalletConnect }) => {
  const yam = useYam();
  const wallet = useWallet();
  const lswRefCode = useLSWReferralCode();
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation('home');
  const [_, setConnectWalletVisible] = useState(true);
  const modalContext = useContext(ModalContext);

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

        setGenerating(false);
      } catch (error) {
        const transactionError = errors.getTransactionError(error);
        modalContext.showError('Error while approving', transactionError.message);
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
        <div className="w-full md:w-6/12 bg-black shadow-xl p-4 mt-6 inline-block text-white font-mono sm:mr-2.5">
          <div dangerouslySetInnerHTML={{ __html: t('referral') }} />
          <div onClick={copy} className="bg-backgroundPage shadow-xl p-4 mt-4 inline-block text-black flex font-mono">
            <span>{copied ? `Copied !` : `delta.financial/join/${lswRefCode.referralId}`}</span>
          </div>
        </div>
      );
    }
    return <TransactionButton text={getCopyForButton()} secondaryLooks onClick={() => (wallet.account ? onGenerateCode() : onWalletConnect())} />;
  };

  return <DeltaSection title={t('deltaReferral')}>
    {/* <DeltaPanel>
      <div>{t('contracts')}</div>
    </DeltaPanel> */}
    {/* <DeltaPanel>
      <FancyButton
        url="https://github.com/Delta-Financial/Smart-Contracts/blob/master/Periphery/DELTA_Limited_Staking_Window.sol"
        text="LSW"
        image={github}
      />
      <FancyButton url="https://github.com/Delta-Financial/Smart-Contracts/tree/master/Governance" text="Governance" image={github} />
      <FancyButton url="https://github.com/Delta-Financial/Smart-Contracts/tree/master/Periphery" text="Periphery" image={github} />
    </DeltaPanel> */}
    {/* <DeltaPanel>
      <DeltaTitleH2>
        {t('deltaReferral')}
      </DeltaTitleH2>
    </DeltaPanel> */}
    <DeltaPanel>
      <div className="w-full md:w-6/12">{t('referral')}</div>
      {renderGenerateLinkButton()}
    </DeltaPanel>
  </DeltaSection>
};

export default ReferralProgram;
