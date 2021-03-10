import errors from './errors';
import { Spinner } from '../components/Spinner';

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
    const transactionMessage = modalContext.showControlledMessage(transactionTitle, <Spinner label={transactionLoadingMessage} />);

    await transaction.send({
      ...transactionParameters,
      gas: transactionGasEstimate
    });

    transactionMessage.close();
    await modalContext.showMessage(successTitle, <div className="text-lg">{successMessage}</div>);

  } catch (error) {
    const decodedError = errors.getTransactionError(error, 'An unexpected error occured');
    console.log(decodedError);
    await modalContext.showError(errorTitle, decodedError.message);
    return Promise.reject();
  }

  return Promise.resolve();
};

export default {
  executeTransaction
};
