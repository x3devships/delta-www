const JoinButton = ({ logo, width }) => {
  return (
    <div className="m-1">
      <a
        href="https://www.facebook.com/QuickToolz"
        title="Quicktoolz On Facebook"
        className="bg-backgroundButton tracking-wide text-gray-800 font-bold py-4 px-4 inline-flex items-center"
      >
        <img src={logo} alt="logo" className="mx-auto" style={{ width, height: '100%' }} />
      </a>
    </div>
  );
};

export default JoinButton;
