const JoinButton = ({ logo, width, url, title }) => {
  return (
    <div className="m-1">
      <a
        href={url}
        title={title}
        className="bg-backgroundButton tracking-wide text-gray-800 hover:bg-gray-800 font-bold py-4 px-4 inline-flex items-center"
      >
        <img src={logo} alt="logo" className="mx-auto" style={{ height:'50px', width:'50px' }} />
      </a>
    </div>
  );
};

export default JoinButton;
