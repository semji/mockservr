import React, { Component } from 'react';
import { Main, Sidebar } from '../../components/Layout/Layout';
import Cartridge from '../../components/Endpoint/Cartridge';
import theme from '../../theme';
import { Header, HeaderButton } from '../../components/Main/Header';
import PlusIcon from '../../components/icons/PlusIcon';
import Card from '../../components/Endpoint/Card';
import { connect } from 'react-redux';
import { fetchEndpoints } from '../../actions/endpoints/endpoints';
import { getEndpoints } from '../../reducers';

export default connect(
  state => ({
    endpoints: getEndpoints(state.endpoints),
  }),
  {
    fetchEndpoints,
  }
)(
  class extends Component {
    componentDidMount() {
      this.props.fetchEndpoints();
    }

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
            {this.props.endpoints.map(endpoint => (
              <Card method="any" path={endpoint.request} calls={37} />
            ))}
          </Main>
        </React.Fragment>
      );
    }
  }
);
