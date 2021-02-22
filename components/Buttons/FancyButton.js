import plus from '../../public/plus.svg';
import upload from '../../public/Upload.svg';

const FancyButton = ({ text, image, url }) => {
  function gourl() {
    window.open(url);
  }
  return (
    <div className="mt-1 w-72 md:w-96 flex text-xs md:text-base">
      <button
        type="button"
        onClick={gourl}
        className="shadow-xl bg-black p-4 h-14 rounded-none inline-block text-white uppercase flex mr-1"
      >
        <img alt="gourl" src={image} className="m-auto" />
      </button>
      <button
        type="button"
        onClick={gourl}
        className="flex justify-between rounded-none bg-black hover:bg-gray-900 shadow-xl flex-grow p-4 h-14 inline-block text-white text-center uppercase flex"
      >
        <div className="text-center">{text}</div>
        <div>
          <img alt="+" src={plus} className="m-auto" />
        </div>
      </button>
      <button
        type="button"
        onClick={gourl}
        className="border-black rounded-non mr-1 hover:bg-gray-100 border bg-white h-14 p-4 inline-block text-white flex ml-2"
      >
        <img alt="gourl" src={upload} className="m-auto" />
      </button>
    </div>
  );
};

export default FancyButton;
