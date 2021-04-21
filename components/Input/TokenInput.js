import { Button, HelperText, Input } from '@windmill/react-ui';
import { useCallback, useContext, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import BigNumber from 'bignumber.js';
import { addressMap, DATA_UNAVAILABLE, tokenMap } from '../../config';
import { useTokenBalance } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { DeltaCheckboxButton } from '.';
import { parsing } from '../../helpers';

// The delay at which the onChange event is trigger when the input
// value is changed.
const ONCHANGE_NOTIFICATION_WAIT = 200;

const TokenInput = ({
  token,
  allowanceRequiredFor,
  buttonText,
  buttonTextLoading,
  labelBottom,
  labelBottomClassName = '',
  checkboxButton,
  checkboxButtonChecked,
  onOk,
  onChange,
  className,
  transactionButtonUnder,
  transactionButtonNoBorders,
  disableTransactionWhenInvalid,
  disabled = false }) => {

  const [amountText, setAmountText] = useState('');
  const [amount, setAmount] = useState(false);
  const [validAmount, setValidAmount] = useState(true);
  const { balance, balanceBN } = useTokenBalance(token);
  const modalContext = useContext(ModalContext);
  const [checkboxChecked, setCheckboxChecked] = useState(checkboxButtonChecked);

  let tokenInfo = {
    decimals: 18
  }

  // delta-all is delta but that will use the whole total balance. So it's
  // not a real token, just handled this way tso that useTokenBalance can
  // use delta's totalWallet instead of balanceOf in this case.
  if (token !== 'ETH' && token !== "delta-all") {
    const tokenAddress = addressMap[token];
    tokenInfo = tokenMap[tokenAddress];

    if (!tokenInfo) {
      throw new Error(`${token} doesn't exist within tokenMap`);
    }
  }

  const onCheckboxChanged = (event) => {
    setCheckboxChecked(event.target.checked);
  };

  const getValues = useCallback(() => {
    let amountBN;

    if (amount) {
      amountBN = parsing.parseFloatToBigNumber(amount, tokenInfo.decimals);
    }

    const valid = validAmount && amount && amountBN;
    if (valid) {
      return {
        amount,
        amountBN,
        checkboxChecked
      }
    }

    return {
      amount: DATA_UNAVAILABLE,
      amountBN: DATA_UNAVAILABLE,
      checkboxChecked
    };
  }, [amount, checkboxChecked]);

  const onNotifyChange = useCallback(debounce(() => {
    const values = getValues();
    if (onChange) {
      return onChange(values.amount, values.amountBN, values.checkboxChecked);
    }
    return Promise.resolve();
  }, ONCHANGE_NOTIFICATION_WAIT), [onChange, getValues]);

  const onBeforeOk = useCallback(async () => {
    const values = getValues();

    if (values.amount !== DATA_UNAVAILABLE) {
      if (!onOk) return Promise.resolve();

      const success = await onOk(values.amount, values.amountBN, true, values.checkboxChecked);
      if (success) {
        setAmountText('');
        setValidAmount(true);
        setAmount(false);
      }

      return success;
    }

    return modalContext.showError('Invalid Amount', 'The specified token amount is invalid');
  }, [getValues]);

  const isFloatAmountGreaterThanMaxBalance = amount => {
    if (amount === balance) {
      return false;
    }

    const amountBN = parsing.parseFloatToBigNumber(amount, tokenInfo.decimals);
    return amountBN.gt(balanceBN);
  };

  const setValidatedAmount = (amount) => {
    if (Number.isNaN(amount) || amount === 0 || amount < 0 || isFloatAmountGreaterThanMaxBalance(amount)) {
      setValidAmount(false);
    } else if (amount > 0) {
      setValidAmount(true);
      setAmount(amount);
    }
  };

  const onMaxAmount = () => {
    const balance = parseFloat(new BigNumber(balanceBN.shiftedBy(-18).toFixed(6, 1)).toString());
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

  useEffect(() => {
    onNotifyChange();
    return onNotifyChange.cancel;
  }, [amount, checkboxChecked]);

  const renderInput = () => {
    let friendlyName = tokenInfo.friendlyName || token.toUpperCase();
    if ( friendlyName === 'DELTA-ALL' ) friendlyName = 'DELTA';
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
        <div className="pr-3 text-sm self-end mb-3">{friendlyName}</div>
      </div>
    </>;
  };

  const renderHelpers = () => {
    return <div className='flex'>
      <HelperText className={`${validAmount ? 'hidden' : ''} text-sm block`} valid={false}>The amount is not valid</HelperText>
      <HelperText className={`text-sm block ${labelBottomClassName} ml-auto`}>{labelBottom}</HelperText>
    </div>;
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
            <div className={`ml-1 hidden md:flex`}>
              {renderTransactionButton()}
              {/* checkboxButton && <div className="flex md:p-1 ml-1 md:border md:border-black flex-grow">
                <DeltaCheckboxButton text={checkboxButton} checked={checkboxChecked} onChange={onCheckboxChanged} />
              </div> */}
            </div>
          </div>
        </div>
        {renderHelpers()}
        <div className={`mt-0`}>
          {checkboxButton && <div className="block">
            <DeltaCheckboxButton text={checkboxButton} checked={checkboxChecked} onChange={onCheckboxChanged} />
          </div>}
        </div>
      </div>
    </div>
  </div >;
};

export default TokenInput;