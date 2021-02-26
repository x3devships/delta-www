import DeltaTitle from './DeltaTitle';

const DeltaTitleH3 = ({ children, className, center }) => {
  return <DeltaTitle center={center} className={`text-xl md:text-2xl ${className}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH3;