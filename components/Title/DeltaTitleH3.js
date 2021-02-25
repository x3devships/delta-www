import DeltaTitle from './DeltaTitle';

const DeltaTitleH3 = ({ children, className }) => {
  return <DeltaTitle className={`text-xl md:text-2xl ${className}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH3;