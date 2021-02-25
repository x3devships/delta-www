const DeltaPanel = ({ children, className }) => {
  return <div className={className}>
    <div className="w-full py-3 md:py-6">
      {children}
    </div>
  </div>;
}

export default DeltaPanel