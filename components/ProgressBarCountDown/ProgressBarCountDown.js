const ProgressBarCountDown = () => {
  return (
    <div className="m-auto text-center">
      <div>
        <div className="w-full bg-purple-100 min-h-12 border border-purple-500 p-1">
          <div
            className="bg-purple bg-purple-400 leading-none h-12"
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-base font-thin mt-2">Limited Staking Window (CLOSED)</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
