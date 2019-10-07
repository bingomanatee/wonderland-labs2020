import {
  Text, TextInput, Box, Button,
} from 'grommet';
import React, { Component } from 'react';
import _ from 'lodash';
import PageFrame from '../../../views/PageFrame';
import WorldGrid from './WorldGrid';
import worldStore from '../../../store/worlds.store';
import DrawWorld from './DrawWorld';
import { World } from '../../../hexagon';

const panelBorder = {
  width: '2px',
  radius: 0,
  color: 'red',
};

export default class WorldPage extends Component {
  constructor(props) {
    const { match } = props;
    super(props);
    const name = _.get(match, 'params.name');

    const worldData = worldStore.state.worlds.get(name);
    const world = worldData ? new World(worldData.name, worldData.resolution) : null;

    this.state = { ...worldData, world };
  }

  render() {
    const { resolution,  world } = this.state;
    if (!world) {
      this.props.history.push('/');
      return '';
    }
    return (
      <WorldGrid>
        <Box border={panelBorder} gridArea="header" pad="medium">
          <h1>
            World
            {' '}
            {`"${world.name}"`}
            (res:
            {resolution}
            )
          </h1>
        </Box>
        <Box border={panelBorder} gridArea="editor">
          <DrawWorld world={world} />
        </Box>
        <Box border={panelBorder} gridArea="panel-one">Panel One</Box>
        <Box border={panelBorder} gridArea="panel-two">Panel Two</Box>
      </WorldGrid>
    );
  }
}
