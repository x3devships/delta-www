import SettingsContext from './SettingsContext';
import React from 'react';

const SettingsProviders = ({ children }) => {
  const store = {};

  const get = (key) => {
    return store[key];
  };
  
  const set = (key, value) => {
    setState(state => {
      const newState = {
        ...state
      };

      newState.store[key] = value;
      return newState;
    })
  };

  const [state, setState] = React.useState({
    store,
    get,
    set
  });

  return <SettingsContext.Provider value={state}>{children}</SettingsContext.Provider>;
};

export default SettingsProviders;
