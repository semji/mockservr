import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: ${props => props.theme.colors.darkGrey};
  padding: 50px 150px;
`;

export const Box = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 6em 12em 1fr;
  grid-template-rows: 4em 1fr;
  grid-template-areas:
    'header header header'
    'menu sidebar main';
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  background: ${props => props.theme.colors.grey};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

export const Header = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.primary};
  padding: 0.6em;
  font-size: 2em;
  z-index: 0;

  &:before {
    display: block;
    position: absolute;
    left: -3em;
    content: '';
    width: 6em;
    height: 100%;
    transform: skewX(-20deg);
    background: ${props => props.theme.colors.transparentWhite};
    z-index: -1;
  }
`;

export const Menu = styled.nav`
  grid-area: menu;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: ${props => props.theme.colors.grey};
  padding: 1em 0;
`;

export const Sidebar = styled.section`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  background: ${props => props.theme.colors.darkGrey};
  padding: 1.5em;
`;

export const Main = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 1000px;
  padding: 1.5em;
`;

export const Push = styled.div`
  display: flex;
  flex-grow: 1;
`;
