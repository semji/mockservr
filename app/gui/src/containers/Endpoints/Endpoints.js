import React, { Component } from 'react';
import { Main, Sidebar } from '../../components/Layout/Layout';
import Cartridge from '../../components/Endpoint/Cartridge';
import theme from '../../theme';
import {Header, HeaderButton} from '../../components/Main/Header';
import PlusIcon from "../../components/icons/PlusIcon";

export default class extends Component {
  render() {
    return (
      <React.Fragment>
        <Sidebar>
          <Cartridge title="/mocks" number={25} color={theme.colors.green} />
          <Cartridge
            title="/internetbs"
            number={13}
            color={theme.colors.yellow}
          />
        </Sidebar>
        <Main>
          <Header>
            <HeaderButton><PlusIcon/> Add an endpoint</HeaderButton>
          </Header>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome to React app</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        </Main>
      </React.Fragment>
    );
  }
}
