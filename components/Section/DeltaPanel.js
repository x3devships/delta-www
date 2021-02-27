const DeltaPanel = ({ children, className }) => {
  return <div className={`${className || ''} w-full`}>
    {children}
  </div>;
}

export default DeltaPanel