import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core';

export default styled(MuiButton)`
  && {
    font-size: 0.8em;
    padding: 0.3em 1em;
    text-transform: uppercase;
    background: none;
    border: none;
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.darkBlueGrey};
  }
`;

