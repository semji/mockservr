import React, { Component } from 'react';
import { Menu } from '../components/Layout/Layout';
import { MenuItem } from '../components/Layout/Menu';
import EndpointsIcon from '../components/icons/EndpointsIcon';
import HistoryIcon from '../components/icons/HistoryIcon';

export default class extends Component {
  render() {
    return (
      <Menu>
        <MenuItem icon={EndpointsIcon} label="endpoints" active to="/" />
        <MenuItem icon={HistoryIcon} label="history" to="/" />
      </Menu>
    );
  }
}
