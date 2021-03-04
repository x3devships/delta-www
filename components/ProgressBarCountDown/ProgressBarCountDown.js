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
        <div className="text-2xl mt-2">What Happens Next?</div>
        <div className="text-lg mt-1"><a target="_blank" rel="noopener noreferrer" href="https://medium.com/delta-financial/delta-lsw-what-happens-next-94c659dc63b7">Read Here &raquo;</a></div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
