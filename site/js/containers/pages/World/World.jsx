import {Text, TextInput, Box, Button} from 'grommet';
import React, {Component} from 'react';
import _ from 'lodash';
import PageFrame from '../../../views/PageFrame';
import WorldGrid from './WorldGrid';

const panelBorder = {
  width: '2px',
  radius: 0,
  color: 'red'
};

export default class World extends Component {

  render() {
    const {match} = this.props;

    return <WorldGrid>
      <Box border={panelBorder} gridArea="header" pad="medium">
        <h1>World "{_.get(match, 'params.name')}"</h1></Box>
      <Box border={panelBorder} gridArea="editor">Editor</Box>
      <Box border={panelBorder} gridArea="panel-one">Panel One</Box>
      <Box border={panelBorder} gridArea="panel-two">Panel Two</Box>
    </WorldGrid>
  }
}
