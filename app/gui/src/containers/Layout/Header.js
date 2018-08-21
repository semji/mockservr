import React, { Component } from 'react';
import { Header, Push } from '../../components/Layout/Layout';
import CogsIcon from '../../components/icons/CogsIcon';

export default class extends Component {
  render() {
    return (
      <Header>
        <Push />
        <CogsIcon />
      </Header>
    );
  }
}
