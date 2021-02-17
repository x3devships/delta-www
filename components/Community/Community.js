import discord from '../../public/Discord.svg';
import github from '../../public/Github.svg';
import telegram from '../../public/Telegram.svg';
import twitter from '../../public/Twitter.svg';
import medium from '../../public/MediumJoin.svg';
import { JoinButton } from '../joinButton';

const Community = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className=" p-5 md:p-20 mx-2">
          <div className="text-center text-6xl">Join The Community</div>
          <div className="flex flex-wrap mt-10 justify-center">
            <JoinButton logo={discord} width="60px" />
            <JoinButton logo={twitter} width="60px" />
            <JoinButton logo={telegram} width="60px" />
            <JoinButton logo={medium} width="60px" />
            <JoinButton logo={github} width="46px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
