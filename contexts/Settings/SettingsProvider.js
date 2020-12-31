import { useState } from 'react';
import SettingsContext from './SettingsContext';

const SettingsProviders = ({ children }) => {
  const store = {};
  const [state, setState] = useState({
    store
  });

  const get = key => {
    return store[key];
  };

  const set = (key, value) => {
    setState(state => {
      const newState = {
        ...state
      };

      newState.store[key] = value;
      return newState;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        get,
        set
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProviders;
