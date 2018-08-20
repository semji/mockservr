import React from 'react';
import { Provider } from 'react-redux';
import ThemeWrapper from '../components/ThemeWrapper';

export default ({ store, children }) => (
  <ThemeWrapper>
    <Provider store={store}>{children}</Provider>
  </ThemeWrapper>
);
