const DeltaPanel = ({ children, className }) => {
  return <div className={`${className} w-full py-3 md:py-6`}>
    {children}
  </div>;
}

export default DeltaPanel