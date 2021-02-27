import { useDelta, useLSWStats, useStaking, useTokenBalance } from '../../hooks'
import GlobalHooksContext from './GlobalHooksContext';

const GlobalHooksProvider = ({ children }) => {
  const delta = useDelta();
  const lswStats = useLSWStats();
  const rlpInfo = useTokenBalance('delta');
  const staking = useStaking();

  return (
    <GlobalHooksContext.Provider
      value={{
        delta,
        lswStats,
        rlpInfo,
        staking
      }}
    >
      {children}
    </GlobalHooksContext.Provider>
  );
};

export default GlobalHooksProvider;
