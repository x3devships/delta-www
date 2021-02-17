import plus from '../../public/plus.svg';
import chevron from '../../public/chevron.svg';

const ReferralProgram = () => {
  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0">
                <div className="flex h-128 border-2 pt-2 border-black pl-9">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9">
                    <div className="grid grid-cols-2 gap-x-96" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <div className="text-4xl pb-4">Delta Referral Program</div>
                        <div className="pb-2">
                          Refer your friend and receive 5% bonus in credit and 5% in ETH. <br /> Your referral will get
                          a 10% bonus to their initial contribution.
                        </div>
                        <div>
                          <button className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex font-mono">
                            <span>GENERATE REFERRAL LINK</span>
                            <img src={plus} className="m-auto pl-8" />
                          </button>
                        </div>
                      </div>
                      <div className="m-auto w-12/12 text-4xl py-9 pt-0">
                        <div className="grid grid-cols-2">
                          <div>Your Referral Rewards</div>
                          <div>
                            <img src={chevron} alt="chevron" className="m-auto mt-0" />
                          </div>
                        </div>
                        <div className="pr-32">
                          <iframe
                            className="mb-9 pr-9"
                            src="https://duneanalytics.com/embeds/20141/41387/X2NcJgZdr4I0XfujHlfTkrPjgR7tFBA9ql0XyWSe"
                            width="720"
                            height="391"
                          />
                        </div>
                        <div className="m-auto w-12/12 text-4xl py-9">
                          Your Referral Bonus
                          <ul className="pl-7" style={{ listStyleType: 'disc' }}>
                            <li>Your Referrals: 07</li>
                            <li>Credit earned: 2.8 LP Credit</li>
                            <li>ETH earned: 2.7 ETH</li>
                          </ul>
                        </div>
                      </div>
                    </div>
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

export default ReferralProgram;
