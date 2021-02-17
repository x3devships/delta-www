import plus from '../../public/plus.svg';
import upload from '../../public/Upload.svg';

const LimitedWindow = ({ text, image }) => {
  return (
    <div className="flex">
      <button
        className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex ml-2"
        style={{ marginRight: '1px' }}
      >
        <img src={image} className="m-auto" />
      </button>
      <button
        className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex"
        style={{ minWidth: '14.1%', justifyContent: 'space-between' }}
      >
        <div>{text}</div>
        <div>
          <img src={plus} className="m-auto pr-2 pt-2" />
        </div>
      </button>
      <button
        className="border-black border bg-transparent p-4 mt-4 inline-block text-white flex ml-2"
        style={{ marginRight: '1px' }}
      >
        <img src={upload} className="m-auto" />
      </button>
    </div>
  );
};

export default LimitedWindow;
