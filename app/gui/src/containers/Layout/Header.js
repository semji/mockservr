import React, { Component } from 'react';
import { Header, Push } from '../../components/Layout/Layout';
import CogsIcon from '../../components/icons/CogsIcon';
import Logo from "../../components/Layout/Logo";

export default class extends Component {
  render() {
    return (
      <Header>
        <Logo />
        <Push />
        <CogsIcon />
      </Header>
    );
  }
}
