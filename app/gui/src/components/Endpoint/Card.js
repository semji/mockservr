import React from 'react';
import styled from 'styled-components';
import { Push } from '../Layout/Layout';
import TrashIcon from '../icons/TrashIcon';
import PenIcon from '../icons/PenIcon';
import theme from '../../theme';
import CallsChart from './CallsChart';

const resolveTagColor = method => {
  switch (method) {
    case 'get':
      return theme.colors.blue;
    case 'post':
      return theme.colors.green;
    case 'delete':
      return theme.colors.red;
    case 'put':
      return theme.colors.yellow;
    case 'patch':
      return theme.colors.orange;
    case 'option':
      return theme.colors.lightGrey;
    default:
      return theme.colors.purple;
  }
};

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  box-shadow: 0 5px 5px -4px rgba(0, 0, 0, 0.1);
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => resolveTagColor(props.method)};
  position: absolute;
  top: -0.3em;
  left: -0.3em;
  padding: 0.5em 0;
  text-transform: uppercase;
  z-index: 1;
  width: 3.5em;

  &:after {
    background: ${props => resolveTagColor(props.method)};
    content: '';
    display: block;
    position: absolute;
    width: 2em;
    height: 100%;
    transform: skew(-20deg);
    right: -0.5em;
    z-index: -1;
  }
`;

const Path = styled.span`
  font-family: Inconsolata;
  font-size: 1.2em;
`;

const TagContent = styled.span`
  font-size: 0.8em;
  font-weight: 600;
  color: ${props => props.theme.colors.grey};
`;

const Number = styled.span`
  font-size: 2.5em;
  font-weight: 600;
  line-height: 1em;
`;

const CounterLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  margin-left: 0.2em;
  opacity: 0.6;
`;

const CounterLabel = styled.span`
  font-size: 1.6em;
  line-height: 1em;
`;

const CounterSubLabel = styled.span`
  font-size: 0.6em;
  line-height: 1em;
  margin-top: 0.2em;
  font-weight: 600;
`;

const Counter = styled(props => (
  <div {...props}>
    <Number>{props.number}</Number>
    <CounterLabelWrapper>
      <CounterLabel>calls</CounterLabel>
      <CounterSubLabel>this last hour</CounterSubLabel>
    </CounterLabelWrapper>
  </div>
))`
  display: flex;
  color: ${props => props.theme.colors.transparentDark};
  text-transform: uppercase;
  font-size: 0.8em;
  width: 8em;
  justify-content: flex-end;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${props => props.theme.colors.blueGrey};
  color: ${props => props.theme.colors.white};
  height: 3em;
  padding-right: 1em;
  position: relative;
  z-index: 0;
  padding-left: 4.5em;

  &:after {
    background: ${props => props.theme.colors.blueGrey};
    content: '';
    display: block;
    position: absolute;
    width: 2em;
    height: 100%;
    transform: skew(-20deg);
    right: -0.6em;
    z-index: -1;
  }
`;

const Actions = styled.div`
  display: flex;
  background: ${props => props.theme.colors.darkBlueGrey};
  padding: 0.5em 1em 0.5em 1.5em;
  height: 2.5em;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};

  & > * {
    margin-right: 1em;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export default styled(({ method, path, calls, ...props }) => (
  <div {...props}>
    <Header>
      <Tag method={method}>
        <TagContent>{method}</TagContent>
      </Tag>
      <HeaderContent>
        <Path>{path}</Path>
        <Push />
        <CallsChart />
        <Counter number={calls} />
      </HeaderContent>
      <Actions>
        <PenIcon />
        <TrashIcon />
      </Actions>
    </Header>
  </div>
))`
  width: 100%;
  padding-left: 0.3em;
  padding-top: 0.3em;
  margin-bottom: 1em;
`;
