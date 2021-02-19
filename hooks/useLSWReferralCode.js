import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import useYam from './useYam';

const initialState = DATA_UNAVAILABLE;

const useLSWReferralCode = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [referralId, setReferralId] = useState(initialState);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const referralId = await yam.contracts.LSW.methods.referralCodeMappingIndexedByAddress(wallet.account).call();
    if (referralId > 0) {
      setReferralId(referralId);
    }
  };

  useEffect(() => {
    let interval;

    if (yam) {
      update();
      interval = setInterval(update, 5000);
    }

    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    referralId
  };
};

export default useLSWReferralCode;
