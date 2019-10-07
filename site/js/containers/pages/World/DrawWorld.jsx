import React, { Component } from 'react';
import DrawWorldView from './DrawWorldView';

export default class DrawWorld extends Component {
  render() {
    const { world } = this.props;
    return <DrawWorldView world={world} />;
  }
}
