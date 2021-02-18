import { ProgressBarCountDown } from '../ProgressBarCountDown';
import { ProgressBar } from '../ProgressBar';
import plus from '../../public/plus.svg';
import chevron from '../../public/chevron.svg';

const Staking = () => {
  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0">
                <div className="m-auto h-80 border-black border-2 border-b">
                  <div className="flex">
                    <div className="m-auto w-10/12 text-4xl py-9 font-display">Limited Staking Window</div>
                    <img src={chevron} alt="chevron" className="m-auto" />
                  </div>
                  <ProgressBarCountDown />
                </div>
                <div className="h-4/6 border-2 pt-2 border-black border-t-0">
                  <div className="m-auto w-11/12 text-4xl py-9">Limited Staking Window</div>
                  <div className="flex space-x-80">
                    <iframe
                      className="mb-9 pl-9"
                      src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                      width="720"
                      height="391"
                    />
                    <iframe
                      className="mb-9 pl-9"
                      src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                      width="720"
                      height="391"
                    />
                  </div>
                </div>
                <div className="flex h-128 border-2 pt-2 border-black border-t-0 pl-9">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9">
                    <div className="text-4xl pb-4">LSW Bonus</div>
                    <div className="pb-2">
                      Delta's Limited staking Window allows you to earn <br /> bonus rewards by being an early
                      participant.
                    </div>
                    <div>
                      <button className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex ">
                        <span>Connect Wallet To Participate</span>
                        <img src={plus} className="m-auto pl-8" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 pr-9 pt-9">
                    <ProgressBar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Staking;
