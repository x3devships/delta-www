import { Button } from '@windmill/react-ui';
import plus from '../../public/plus.svg';
import upload from '../../public/Upload.svg';

const LimitedWindow = ({ text, image, url }) => {
  function gourl() {
    window.open(url);
  }
  return (
    <div className="flex w-80 xs:w-72 xs:-m-2">
      <Button
        onClick={gourl}
        className="shadow-xl p-4 mt-4 inline-block text-white uppercase flex ml-2"
        style={{ marginRight: '1px', borderRadius: '0px', backgroundColor: 'black' }}
      >
        <img src={image} className="m-auto" />
      </Button>
      <Button
        onClick={gourl}
        className="bg-black shadow-xl flex-grow p-4 mt-4 inline-block text-white text-center uppercase flex font-gt_america"
        style={{
          minWidth: '14.1%',
          justifyContent: 'space-between',
          marginRight: '1px',
          borderRadius: '0px',
          backgroundColor: 'black',
          display: 'flex'
        }}
      >
        <div className="text-center">{text}</div>
        <div>
          <img src={plus} className="m-auto" />
        </div>
      </Button>
      <Button
        onClick={gourl}
        className="border-black hover:bg-gray-100 border bg-transparent p-4 mt-4 inline-block text-white flex ml-2"
        style={{ marginRight: '1px', borderRadius: '0px', backgroundColor: 'white' }}
      >
        <img src={upload} className="m-auto" />
      </Button>
    </div>
  );
};

export default LimitedWindow;
