import { Button } from '@windmill/react-ui';
import plus from '../../public/plus.svg';
import upload from '../../public/Upload.svg';

const LimitedWindow = ({ text, image, url }) => {
  function gourl() {
    window.open(url);
  }
  return (
    <div className="flex w-80 xs:w-72 xs:-m-2 mt-2">
      <button
        onClick={gourl}
        className="shadow-xl p-4 h-14  inline-block text-white uppercase flex ml-2"
        style={{ marginRight: '1px', borderRadius: '0px', backgroundColor: 'black' }}
      >
        <img src={image} className="m-auto" />
      </button>
      <button
        onClick={gourl}
        className="bg-black hover:bg-gray-900  shadow-xl flex-grow p-4 h-14 inline-block text-white text-center uppercase flex font-gt_america"
        style={{
          minWidth: '14.1%',
          justifyContent: 'space-between',
          marginRight: '1px',
          borderRadius: '0px',
          display: 'flex'
        }}
      >
        <div className="text-center">{text}</div>
        <div>
          <img src={plus} className="m-auto" />
        </div>
      </button>
      <button
        onClick={gourl}
        className="border-black hover:bg-gray-100 border bg-white  h-14 p-4 inline-block text-white flex ml-2"
        style={{ marginRight: '1px', borderRadius: '0px' }}
      >
        <img src={upload} className="m-auto" />
      </button>
    </div>
  );
};

export default LimitedWindow;
