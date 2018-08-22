import React, { Component } from 'react';
import { Main, Sidebar } from '../../components/Layout/Layout';
import Cartridge from '../../components/Endpoint/Cartridge';
import theme from '../../theme';
import { Header, HeaderButton } from '../../components/Main/Header';
import PlusIcon from '../../components/icons/PlusIcon';
import Card from '../../components/Endpoint/Card';

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
            <HeaderButton>
              <PlusIcon /> Add an endpoint
            </HeaderButton>
          </Header>
          <Card method="get" path="/mocks" calls={37} />
          <Card method="post" path="/mocks/:id" calls={5} />
          <Card method="put" path="/mocks/:id" calls={5} />
          <Card method="patch" path="/mocks/:id" calls={5} />
          <Card method="option" path="/mocks/:id" calls={5} />
          <Card method="delete" path="/mocks/:id" calls={5} />
          <Card method="custom" path="/mocks/:id" calls={5} />
        </Main>
      </React.Fragment>
    );
  }
}
