import DeltaTitle from './DeltaTitle';

const DeltaTitleH2 = ({ children, className, center, lineunder }) => {
  return <DeltaTitle center={center} className={`text-xl md:text-3xl ${lineunder ? 'border-b border-black pb-2' : ''} ${className || ''}`}>
    {children}
  </DeltaTitle>;
}

export default DeltaTitleH2;