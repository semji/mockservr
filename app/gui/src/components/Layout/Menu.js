import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const ItemIcon = styled(({ icon, ...props }) => icon(props))`
  &&& {
    font-size: 3em;
    margin-bottom: 7px;
  }
`;

const ItemLabel = styled.span``;

export const MenuItem = styled(({ icon, label, active, ...props }) => (
  <NavLink {...props}>
    <ItemIcon icon={icon} />
    <ItemLabel>{label}</ItemLabel>
  </NavLink>
))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.grey};
  color: ${props =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.transparentBlack};
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.7em;
  height: 7em;
  width: 100%;
  position: relative;
  transition: color 400ms;

  &:after {
    display: block;
    content: '';
    width: 10px;
    height: 10px;
    background: ${props => props.theme.colors.grey};
    position: absolute;
    right: ${props => (props.active ? '-5px' : '5px')};
    transition: right 400ms;
    transform: rotate(45deg);
  }

  &:hover {
    color: ${props => props.theme.colors.primary};

    &:after {
      right: -5px;
    }
  }
`;
