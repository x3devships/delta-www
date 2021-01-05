import { useContext } from 'react';
import YamContext from '../contexts/Yam/YamContext';

const useYam = () => {
  const { yam } = useContext(YamContext);
  return yam;
};

export default useYam;
