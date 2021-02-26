import { ethers } from 'ethers';
import { Button, HelperText, Input } from '@windmill/react-ui';
import { useState } from 'react';
import { addressMap } from '../../config';
import { useTokenBalance } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';

const TokenInput = ({ token, allowanceRequiredFor, buttonText, buttonTextLoading, labelBottom, onOk, disabled = false, }) => {
  const [amountText, setAmountText] = useState('');
  const [amount, setAmount] = useState(false);
  const [validAmount, setValidAmount] = useState(true);
  const balance = useTokenBalance(token);

  const tokenInfo = addressMap[token];

  const onBeforeOk = () => {
    const amountBN = ethers.utils.parseUnits(amount, tokenInfo.decimals);
    onOk(amount, amountBN);
  };

  const onMaxAmount = () => {
    setAmountText(balance);
    setAmount(balance);
  };

  const onAmountChanged = e => {
    const text = e.target.value.trim();
    setAmountText(text);
    setValidAmount(true);

    if (text === '') {
      setAmount(false);
      return;
    }

    const potentialAmount = parseFloat(e.target.value);
    if (potentialAmount > balance || potentialAmount < 0 || Number.isNaN(potentialAmount) || potentialAmount == 0) {
      setValidAmount(false);
    } else if (potentialAmount > 0) {
      setAmount(potentialAmount);
    }
  };


  return <div className="mt-4">
    <div className="flex md:grid md:gap-2 md:grid-cols-2">
      <div className="bg-white flex border border-black">
        <div className="p-3">
          <Input
            disabled={disabled}
            type="number"
            value={amountText}
            placeholder='0.00'
            onChange={onAmountChanged}
            valid={validAmount}
            className="border-transparent text-xl border-b border-black"
          />
        </div>
        <div className="pr-3 text-sm self-end mb-3">{tokenInfo.friendlyName}</div>
      </div>
      <div className="p-1 max-w-max border border-black ml-1 md:ml-0">
        <Button disabled={disabled} onClick={() => onMaxAmount()} className="bg-gray-400 h-full ring-pink-300 ring-inset focus:bg-gray-400">
          <span className="uppercase">max</span>
        </Button>
      </div>
    </div>
    {!validAmount && <HelperText valid={false}>The amount is not valid</HelperText>}
    <div className="text-gray-600 font-thin text-sm">{labelBottom}</div>

    <TransactionButton
      allowanceRequiredFor={allowanceRequiredFor}
      text={buttonText}
      textLoading={buttonTextLoading}
      secondaryLooks
      disabled={disabled}
      onClick={onBeforeOk}
    />
  </div>;
};

export default TokenInput;
