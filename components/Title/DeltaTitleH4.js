import DeltaTitle from './DeltaTitle';

const DeltaTitleH4 = ({ children, className, center }) => {
  return <DeltaTitle center={center} className={`text-lg md:text-xl ${className || ''}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH4;