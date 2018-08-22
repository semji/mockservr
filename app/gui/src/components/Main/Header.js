import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';

export const Header = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.primary};
  padding-bottom: 1em;
  justify-content: flex-end;
  margin-bottom: 1em;
`;

export const HeaderButton = styled(Button)`
  && {
    svg {
      font-size: 1.6em;
      margin-right: 0.4em;
    }
  }
`;
