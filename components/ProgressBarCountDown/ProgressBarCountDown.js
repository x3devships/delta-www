const ProgressBarCountDown = () => {
  return (
    <div className="m-auto w-11/12 text-center">
      <div className="border-black border p-2">
        <div className="w-full bg-backgroundLightPurple h-16 w-32">
          <div
            className="bg-backgroundLightPurple bg-gradient-to-r from-gradiantBlue to-gradiantPurple leading-none py-1 h-16 w-32"
            style={{ width: '85%' }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-2xl">02 Days 5 Hours 33 Minutes</div>
        <div className="text-xs font-thin">Until Limited Staking Window Is Open</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
