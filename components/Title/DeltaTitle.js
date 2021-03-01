const DeltaTitle = ({ children, className, center }) => {
  return <div className={`${center && "text-center"} flex-grow font-wulkan ${className || ''}`}>
    {children}
  </div >;
}

export default DeltaTitle