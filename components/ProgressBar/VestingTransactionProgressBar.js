const VestingTransactionProgressBar = ({ transaction }) => {
  return <div className="relative pt-1">
    <div className="flex mb-2 items-center justify-between">
      <div>
        <span className="text-sm font-semibold inline-block py-1 px-2 uppercase rounded-none text-gray-900 bg-gray-300">
          Transaction #{transaction.index}
        </span>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold inline-block text-black">
          {transaction.percentVested * 100}%
      </span>
      </div>
    </div>
    <div className="overflow-hidden h-2 mb-4 text-sm flex rounded bg-gray-400">
      <div style={{ width: `${transaction.percentVested * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black" />
    </div>
  </div>
};

export default VestingTransactionProgressBar;
