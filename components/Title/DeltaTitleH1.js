import DeltaTitle from './DeltaTitle';

const DeltaTitleH1 = ({ children, className }) => {
  return <DeltaTitle className={`text-2xl md:text-4xl ${className}`}>
    {children}
  </DeltaTitle >;
}

export default DeltaTitleH1