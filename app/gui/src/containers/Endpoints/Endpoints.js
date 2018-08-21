import React, { Component } from 'react';
import { Main, Sidebar } from '../../components/Layout/Layout';

export default class extends Component {
  render() {
    return (
      <React.Fragment>
        <Sidebar />
        <Main>
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
