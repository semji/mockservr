import React from 'react';
import { Provider } from 'react-redux';
import ThemeWrapper from '../components/ThemeWrapper';
import {BrowserRouter as Router} from "react-router-dom";

export default ({ store, children }) => (
  <ThemeWrapper>
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  </ThemeWrapper>
);
