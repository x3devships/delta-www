const getTransactionError = (error, defaultErrorMessage = 'An unexpected error occurred') => {
  if (!error.message || error.message.indexOf(':') === -1) {
    return new Error(defaultErrorMessage);
  }

  let message = (error.message.split(':')[1] || '') + (error.message.split(':')[2] || '');
  message = message.split('{')[0] || '';

  return new Error(message);
};

export default {
  getTransactionError
};
