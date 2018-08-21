import React, { Component } from 'react';
import { Background, Box } from '../components/Layout/Layout';
import Header from './Layout/Header';
import Menu from './Layout/Menu';
import Endpoints from './Endpoints/Endpoints';
import { Route, Switch, Redirect } from 'react-router-dom';

export default class extends Component {
  render() {
    return (
      <Background>
        <Box>
          <Header />
          <Menu />
          <Switch>
            <Redirect exact={true} from="/" to={'/endpoints'} />
            <Route path="/endpoints" component={Endpoints} />
          </Switch>
        </Box>
      </Background>
    );
  }
}
