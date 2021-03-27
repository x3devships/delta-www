const VestingTransactionProgressBar = ({ transaction }) => {
  const percentMature = transaction.percentVested * 100;
  const percentImmature = (1 - transaction.percentVested) * 100;

  return <div className="w-full flex min-h-6 border border-black p-1 text-xs">
    <div className="flex bg-gradiantBlue leading-none h-6 w-full mr-0.5 text-left text-white" style={{ width: `${percentMature}%` }}>
      <div className="ml-1 md:ml-1 self-center">{percentMature.toFixed(0)}%</div>
    </div>
    {percentMature < 100 && <div className="flex bg-gradient-to-r from-gradientPink to-gradientPink2 leading-none h-6 w-full text-left text-white" style={{ width: `${percentImmature}%` }}>
      {percentMature <= 90 && <div className="ml-1 md:ml-1 self-center">{percentImmature.toFixed(0)}%</div>}
    </div>}
  </div>
};

export default VestingTransactionProgressBar;
