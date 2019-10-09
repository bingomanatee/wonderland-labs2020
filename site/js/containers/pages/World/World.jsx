import {
  Text, TextInput, Box, Button,
} from 'grommet';
import React, { Component } from 'react';
import _ from 'lodash';
import WorldGrid from './WorldGrid';
import worldStore from '../../../store/worlds.store';
import DrawWorld from './DrawWorld';
import { World } from '../../../hexagon';

import Elevations from './panels/Elevations';
import Brushes from './panels/Brush';

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

    const world = worldStore.state.worlds.get(name);

    this.state = { world };
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  componentDidMount() {
    this._sub = worldStore.subscribe(({ state }) => {
      this.setState(state);
    }, (err) => {
      console.log('worldStore error: ', err);
    });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const newWorldName = _.get(this, 'props.match.params.name');
    if (this.state.world.name !== newWorldName) {
      return worldStore.state.worlds.get(newWorldName);
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, world) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (world) {
      this.setState({ world });
    }
  }

  render() {
    const { world } = this.state;
    if (!world) {
      this.props.history.push('/');
      return '';
    }
    return (
      <WorldGrid>
        <Box gridArea="header" pad="medium">
          <Text size="medium" weight="bold">
            World
            {' '}
            {`"${world.name}"`}
            (res:
            {world.resolution}
            )
          </Text>
        </Box>
        <Box gridArea="editor">
          <DrawWorld world={world} />
        </Box>
        <Box gridArea="panel-one">
          <Elevations world={world} />
        </Box>
        <Box gridArea="panel-two">
          <Brushes world={world} />
        </Box>
      </WorldGrid>
    );
  }
}
