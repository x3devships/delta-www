import plus from '../../public/plus.svg';
import upload from '../../public/Upload.svg';

const LimitedWindow = ({ text, image, url }) => {
  function gourl() {
    window.open(url);
  }
  return (
    <div className="flex w-80">
      <button
        type="submit"
        onClick={gourl}
        className="bg-black shadow-xl hover:bg-gray-800 p-4 mt-4 inline-block text-white uppercase flex ml-2"
        style={{ marginRight: '1px' }}
      >
        <img src={image} className="m-auto" alt="img" />
      </button>
      <button
        type="submit"
        onClick={gourl}
        className="bg-black shadow-xl flex-grow hover:bg-gray-800 p-4 mt-4 inline-block text-white uppercase flex"
        style={{ minWidth: '14.1%', justifyContent: 'space-between' }}
      >
        <div>{text}</div>
        <div>
          <img src={plus} className="m-auto pr-2 pt-2" alt="img" />
        </div>
      </button>
      <button
        type="submit"
        onClick={gourl}
        className="border-black hover:bg-gray-100 border bg-transparent p-4 mt-4 inline-block text-white flex ml-2"
        style={{ marginRight: '1px' }}
      >
        <img src={upload} className="m-auto" alt="img" />
      </button>
    </div>
  );
};

export default LimitedWindow;
