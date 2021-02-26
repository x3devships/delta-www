import DeltaTitle from './DeltaTitle';

const DeltaTitleH2 = ({ children, className, center }) => {
  return <DeltaTitle center={center} className={`text-xl md:text-3xl ${className}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH2;