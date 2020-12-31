import { useContext } from 'react';
import { Context } from '../contexts/Yam/YamProvider';

const useYam = () => {
  const { yam } = useContext(Context);
  return yam;
};

export default useYam;
