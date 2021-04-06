import errors from './errors';
import { Spinner } from '../components/Spinner';

const GAS_ESTIMATION_RATIO = 1.25;

const executeTransaction = async (
  modalContext,
  transaction,
  transactionParameters = {},
  successMessage,
  successTitle = 'Success',
  errorTitle = 'Error',
  transactionTitle = 'Transaction',
  transactionLoadingMessage = 'Transaction in progress...') => {

  try {
    const transactionGasEstimate = await transaction.estimateGas(transactionParameters);
    const adjustedTransactionGasEstimate = Math.round(transactionGasEstimate * GAS_ESTIMATION_RATIO);

    const transactionMessage = modalContext.showControlledMessage(transactionTitle, <Spinner label={transactionLoadingMessage} />);

    await transaction.send({
      ...transactionParameters,
      gas: adjustedTransactionGasEstimate
    });

    transactionMessage.close();
    await modalContext.showMessage(successTitle, <div className="text-lg">{successMessage}</div>);

  } catch (error) {
    const decodedError = errors.getTransactionError(error, 'An unexpected error occured');
    console.log(error);
    await modalContext.showError(errorTitle, decodedError.message);
    return Promise.reject();
  }

  return Promise.resolve();
};

const getRevertMessageFromTransaction = async (transaction, transactionParameters = {}) => {
  try {
    await transaction.estimateGas(transactionParameters);
  } catch (error) {
    const decodedError = errors.getTransactionError(error, 'An unexpected error occured');
    return Promise.resolve(decodedError.message);
  }

  return Promise.resolve(false);
};

export default {
  executeTransaction,
  getRevertMessageFromTransaction
};
