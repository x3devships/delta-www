import DeltaTitle from './DeltaTitle';
import {Tooltip} from '../Tooltip';

const DeltaTitleH4 = ({ children, className, center, tip }) => {
  return (
		<DeltaTitle center={center} className={`text-lg md:text-xl ${className || ''}`}>
    	{children}
    	<Tooltip {...{tip}}/>
  	</DeltaTitle>
  );
}

export default DeltaTitleH4;