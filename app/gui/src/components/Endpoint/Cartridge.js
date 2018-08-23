import React from 'react';
import styled from 'styled-components';

const Title = styled.span`
  text-transform: uppercase;
  font-weight: 600;
  color: ${props => props.theme.colors.grey};
  width: 100%;

  &:after {
    display: block;
    width: calc(100% + 1em);
    height: 2px;
    background: ${props => props.theme.colors.grey};
    content: '';
    margin: 0.2em 0;
  }
`;

const Count = styled.span`
  text-transform: uppercase;
  color: ${props => props.theme.colors.transparentDark};
  font-size: 0.8em;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: ${props => props.color};
  position: relative;
  z-index: 0;
  width: 100%;
  overflow: hidden;
  padding: 0.5em 1em;

  &:before {
    display: block;
    position: absolute;
    left: -3em;
    content: '';
    width: 6em;
    height: 100%;
    transform: skewX(-15deg);
    background: ${props => props.theme.colors.transparentLight};
    z-index: -1;
  }
`;

export default styled(({ title, number, ...props }) => (
  <div {...props}>
    <Content>
      <Title>{title}</Title>
      <Count>{number} endpoints</Count>
    </Content>
  </div>
))`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5em;
  
  ${Content} {
    background: ${props => props.color};
  }

  &:before {
    position: absolute;
    background: ${props => props.color};
    opacity: 0.3;
    height: 4px;
    width: 95%;
    bottom: -4px;
    content: '';
    display: block;
  }

  &:after {
    position: absolute;
    background: ${props => props.color};
    opacity: 0.1;
    height: 4px;
    width: 90%;
    bottom: -8px;
    content: '';
    display: block;
  }
`;
