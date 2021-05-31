import DeltaTitle from './DeltaTitle';
import {Tooltip} from '../Tooltip';

const DeltaTitleH2 = ({ children, className, center, lineunder, tip }) => {
  return (
	  <DeltaTitle center={center} className={`${tip ? 'flex' : ''} text-xl md:text-3xl ${lineunder ? 'border-b border-black pb-2' : ''} ${className || ''}`}>
	    {children}
	    <Tooltip {...{tip}}/>
	  </DeltaTitle>
  );
}

export default DeltaTitleH2;