import useTranslation from 'next-translate/useTranslation';
import medium from '../../public/Medium.svg';
import youtube from '../../public/Youtube.svg';
import chevron from '../../public/chevron.svg';
import { ConnectionButton } from '../ConnectionButton';
import Square from '../Square';

const LimitedWindow = () => {
  const { t } = useTranslation('home');
  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-1 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row h-full w-full">
            <div className="h-full w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full h-full min-h-0 min-w-0">
                <Square >
                  <div className="flex">
                    <div
                      className=" text-4xl py-9 font-wulkan"
                      dangerouslySetInnerHTML={{ __html: t('limitedWindow') }}
                    />
                    <img src={chevron} alt="chevron" className="m-auto" />
                  </div>

                  <div className="font-wulkan">{t('deltaAcademy')}</div>
                  <div className="  pb-12 sm:pl-1">
                    <ConnectionButton
                      url="https://medium.com/delta-financial/introducing-delta-financial-769d387e9430"
                      text="ANNOUNCING DELTA"
                      image={medium}
                    />
                    <ConnectionButton
                      url="https://medium.com/delta-financial/delta-tokenizing-open-vested-liquidity-7b115d03fb5"
                      text="DELTA BASICS"
                      image={medium}
                    />
                    <ConnectionButton
                      url="https://medium.com/delta-financial/deep-farming-vault-yield-maximizing-strategy-a453a24a68d4"
                      text="HOW TO PARTICIPATE"
                      image={medium}
                    />
                  </div>
                </Square>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default LimitedWindow;
