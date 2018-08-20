import React from 'react';
import { ThemeProvider, injectGlobal } from 'styled-components';
import theme from '../theme';
import '../utils/resetCss';
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';

injectGlobal`
  @font-face {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 400;
    src: local('Oswald Regular'), local('Oswald-Regular'), url(https://fonts.gstatic.com/s/oswald/v16/TK3iWkUHHAIjg752GT8Gl-1PKw.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  @font-face {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 300;
    src: local('Oswald Light'), local('Oswald-Light'), url(https://fonts.gstatic.com/s/oswald/v16/TK3hWkUHHAIjg75-sh0Tus9CAZek1w.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  html,
  body,
  #root {
    font-family: ${theme.text.font};
    height: 100%;
  }
  
  input, textarea, select, button {
    font-family: ${theme.text.font};
  }
`;

const muiTheme = createMuiTheme({
  palette: {
    primary: { main: theme.colors.primary, dark: theme.colors.primary },
  },
  typography: {
    fontFamily: theme.text.font,
  },
});

export default ({ children }) => (
  <MuiThemeProvider theme={muiTheme}>
    <CssBaseline />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </MuiThemeProvider>
);
