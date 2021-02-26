import { useDelta, useLSWStats } from '../../hooks'
import GlobalHooksContext from './GlobalHooksContext';

const GlobalHooksProvider = ({ children }) => {
  const delta = useDelta();
  const lswStats = useLSWStats();

  return (
    <GlobalHooksContext.Provider
      value={{
        delta,
        lswStats
      }}
    >
      {children}
    </GlobalHooksContext.Provider>
  );
};

export default GlobalHooksProvider;
