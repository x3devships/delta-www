import DeltaTitle from './DeltaTitle';

const DeltaTitleH4 = ({ children, className }) => {
  return <DeltaTitle className={`text-lg md:text-xl ${className}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH4;