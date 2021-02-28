const ProgressBarDiamonds = ({ className }) => {
  return <div className={`m-auto text-center ${className}`}>
    <div className="w-full flex border border-black p-2">
      <div className="flex w-full bg-gradient-to-r from-gradiantGreen1 to-gradiantGreen2 leading-none h-12 md:h-16">
        <div className="ml-4 flex bg-white border border-diamondGreen m-auto transform -rotate-45 diamond-progressbar-small md:diamond-progressbar-base">
          <div className="transform rotate-45 text-xs self-center m-auto">1x</div>
        </div>
        <div className="border-t w-full border-white border-dashed self-center mt-px flex-grow" />
        <div className="mr-4 flex bg-diamondGreen border border-white m-auto transform -rotate-45 diamond-progressbar-small md:diamond-progressbar-base">
          <div className="transform rotate-45 text-xs self-center m-auto text-white">30x</div>
        </div>
      </div>
    </div>
  </div>
};

export default ProgressBarDiamonds;
