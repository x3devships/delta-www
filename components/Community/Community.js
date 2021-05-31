import github from '../../public/Github.svg';
import telegram from '../../public/Telegram.svg';
import twitter from '../../public/Twitter.svg';
import medium from '../../public/MediumJoin.svg';
import { DeltaTitleH1 } from '../Title';

const JoinButton = ({ logo, url, title }) => {
  return (
    <div className="m-1">
      <a
        href={url}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-backgroundButton tracking-wide text-gray-800 hover:bg-gray-800 font-bold py-4 px-4 inline-flex items-center"
      >
        <img src={logo} alt="logo" className="mx-auto w-6 h-6 md:w-12 md:h-12 min-h-full min-w-full max-w-full max-h-full" />
      </a>
    </div>
  );
};

const Community = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="p-5 md:p-8 mx-2 sm:p-5 text-center mt-4">
          <DeltaTitleH1>Join The Community</DeltaTitleH1>
          <div className="flex flex-wrap mt-2 md:mt-4 justify-center">
            <JoinButton url="https://twitter.com/Delta_Token" title="Twitter" logo={twitter} />
            <JoinButton url="https://t.me/Delta_Financial" title="Telegram" logo={telegram} />
            <JoinButton url="https://medium.com/delta-financial" title="Medium" logo={medium} />
            <JoinButton url="https://github.com/Delta-Financial" title="Github" logo={github} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
