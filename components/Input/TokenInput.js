import { ethers } from 'ethers';
import { Button, HelperText, Input } from '@windmill/react-ui';
import { useContext, useState } from 'react';
import { addressMap, tokenMap } from '../../config';
import { useTokenBalance } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';

const TokenInput = ({
  token,
  allowanceRequiredFor,
  buttonText,
  buttonTextLoading,
  labelBottom,
  labelBottomClassName = '',
  onOk,
  className,
  transactionButtonUnder,
  transactionButtonNoBorders,
  disableTransactionWhenInvalid,
  disabled = false }) => {

  const [amountText, setAmountText] = useState('');
  const [amount, setAmount] = useState(false);
  const [validAmount, setValidAmount] = useState(true);
  const { balance } = useTokenBalance(token);
  const modalContext = useContext(ModalContext);

  const tokenAddress = addressMap[token];
  const tokenInfo = tokenMap[tokenAddress];

  if (!tokenInfo) {
    throw new Error(`${token} doesn't exist within tokenMap`);
  }

  const onBeforeOk = async () => {
    let amountBN;

    if (amount) {
      try {
        amountBN = ethers.utils.parseUnits(amount.toString(), tokenInfo.decimals);
      } catch (e) {
        throw new Error(`Error converting float number to bignumber, ${e.message}`);
      }
    }

    const valid = validAmount && amount;
    if (!valid) {
      await modalContext.showError('Invalid Amount', 'The specified token amount is invalid');
    } else {
      onOk(amount, amountBN);
    }
  };

  const setValidatedAmount = (amount) => {
    if (amount > balance || amount < 0 || Number.isNaN(amount) || amount === 0) {
      setValidAmount(false);
    } else if (amount > 0) {
      setValidAmount(true);
      setAmount(amount);
    }
  };

  const onMaxAmount = () => {
    setAmountText(balance);
    setValidatedAmount(balance);
  };

  const onAmountChanged = e => {
    const text = e.target.value.trim();
    setAmountText(text);
    setValidAmount(true);

    if (text.trim() === '') {
      setAmount(false);
      return;
    }

    const potentialAmount = parseFloat(e.target.value);
    setValidatedAmount(potentialAmount);
  };

  const renderInput = () => {
    return <>
      <div className="bg-white flex border border-black">
        <div className="p-2">
          <Input
            disabled={disabled}
            type="number"
            value={amountText}
            placeholder='0.00'
            onChange={onAmountChanged}
            valid={validAmount}
            className="border-transparent text-xl border-b border-black flex-grow"
          />
        </div>
        <div className="pr-3 text-sm self-end mb-3">{tokenInfo.friendlyName}</div>
      </div>
    </>;
  };

  const renderHelpers = () => {
    return <>
      <HelperText className={`${validAmount ? 'hidden' : ''} text-sm block`} valid={false}>The amount is not valid</HelperText>
      <HelperText className={`text-sm block ${labelBottomClassName}`}>{labelBottom}</HelperText>
    </>;
  };

  const renderMaxButton = () => {
    return <div className="p-1 border border-black ml-1">
      <Button disabled={disabled} onClick={() => onMaxAmount()} className="bg-gray-400 h-full ring-pink-300 ring-inset focus:bg-gray-400">
        <span className="uppercase">max</span>
      </Button>
    </div>;
  };

  const renderTransactionButton = () => {
    return <TransactionButton
      className={`flex ${!transactionButtonNoBorders ? 'md:p-1 md:border md:border-black' : ''} flex-grow ${transactionButtonUnder ? 'md:block text-right' : ''}`}
      allowanceRequiredFor={allowanceRequiredFor}
      text={buttonText}
      textLoading={buttonTextLoading}
      secondaryLooks
      disabled={disabled || (disableTransactionWhenInvalid && !(validAmount && amount))}
      onClick={onBeforeOk}
    />;
  };

  return <div className={className}>
    <div className="flex">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex">
            {renderInput()}
            {renderMaxButton()}
            <div className={`ml-1 hidden ${!transactionButtonUnder ? 'md:flex' : ''}`}>
              {renderTransactionButton()}
            </div>
          </div>
        </div>
        {renderHelpers()}
      </div>
    </div>
    <div className={`mt-4 ${!transactionButtonUnder ? 'md:hidden' : ''}`}>
      {renderTransactionButton()}
    </div>
  </div >;
};

export default TokenInput;
