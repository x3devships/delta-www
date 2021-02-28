const ProgressBarCountDown = ({ progress = 100 }) => {
  return (
    <div className="m-auto">
      <div className=" border border-black p-1 md:p-2">
        <div className="w-full bg-backgroundLightPurple min-h-8 md:min-h-12">
          <div className="bg-gradient-to-r from-gradiantBlue to-gradiantPurple leading-none h-8 md:h-12" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
