import {Grid, Text, TextInput, Box, RangeInput, Button} from 'grommet';
import React, {Component} from 'react';
import _ from 'lodash';

export default class World extends Component {


  render() {
    const {match} = this.props;

    return <div>
      <h1>World "{_.get(match, 'params.name')}"</h1>
      <p>Details</p>
    </div>
  }
}
