import React from 'react';
import { Provider } from 'react-redux';

export default ({ store, children }) => (
  <Provider store={store}>{children}</Provider>
);
