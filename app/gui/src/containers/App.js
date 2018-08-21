import React, { Component } from 'react';
import { Background, Box } from '../components/Layout/Layout';
import Header from './Layout/Header';
import Menu from './Layout/Menu';
import Endpoints from "./Endpoints/Endpoints";

export default class extends Component {
  render() {
    return (
      <Background>
        <Box>
          <Header />
          <Menu />
          <Endpoints />
        </Box>
      </Background>
    );
  }
}
