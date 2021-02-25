import useTranslation from 'next-translate/useTranslation';
import github from '../../public/Github.svg';
import telegram from '../../public/Telegram.svg';
import twitter from '../../public/Twitter.svg';
import medium from '../../public/MediumJoin.svg';
import { JoinButton } from '../joinButton';

const Community = () => {
  const { t } = useTranslation('home');
  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className=" p-5 md:p-20 mx-2 sm:p-5">
          <div className="text-center text-4xl pt-12 font-wulkan">{t('joinTheCommunity')}</div>
          <div className="flex flex-wrap mt-5 justify-center">
            <JoinButton url="https://twitter.com/Delta_Token" title="Twitter" logo={twitter} width="60px" />
            <JoinButton url="https://t.me/Delta_Financial" title="Telegram" logo={telegram} width="60px" />
            <JoinButton url="https://medium.com/delta-financial" title="Medium" logo={medium} width="60px" />
            <JoinButton url="https://github.com/Delta-Financial" title="Github" logo={github} width="46px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
