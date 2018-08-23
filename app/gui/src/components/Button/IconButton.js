import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core';

export default styled(props => <MuiButton variant="fab" {...props} />)`
  && {
    font-size: 0.9em;
    color: inherit;
    background: none;
    box-shadow: none;
    width: auto;
    height: auto;
    min-height: 0;
    padding: 8px;
    transition: all 400ms;

    &:hover {
      background: ${props => props.theme.colors.transparentDark};
      transform: rotate(-45deg) scale(1.1);
    }
  }
`;
