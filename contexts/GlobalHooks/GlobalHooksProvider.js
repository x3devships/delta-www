import { useBlock, useDelta, useLSWStats, useRebasing, useStaking, useTokenBalance } from '../../hooks'
import GlobalHooksContext from './GlobalHooksContext';

const GlobalHooksProvider = ({ children }) => {
  const delta = useDelta();
  const lswStats = useLSWStats();
  const staking = useStaking();
  const rebasing = useRebasing();
  const blockInfo = useBlock();
  const rlpInfo = useTokenBalance('rLP');

  return (
    <GlobalHooksContext.Provider
      value={{
        delta,
        lswStats,
        rlpInfo,
        staking,
        rebasing,
        blockInfo
      }}
    >
      {children}
    </GlobalHooksContext.Provider>
  );
};

export default GlobalHooksProvider;
