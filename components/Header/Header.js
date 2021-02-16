import logo from '../../public/HeaderLogo.svg';

const header = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-black p-6">
      <div className="flex items-center flex-no-shrink text-white mr-6">
        <img src={logo} height="150" width="150" />
      </div>
      <div>
        <a
          href="#"
          className="inline-block text-sm px-4 py-2 leading-none text-white hover:border-transparent mt-4 lg:mt-0 uppercase"
        >
          Connect Wallet
        </a>
      </div>
    </nav>
  );
};

export default header;
