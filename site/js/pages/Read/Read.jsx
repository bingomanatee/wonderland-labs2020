import {
  Text, TextInput, Box, Button,
} from 'grommet';
import React, { Component } from 'react';
import _ from 'lodash';
import readStore from './read.store';
import PageFrame from '../../views/PageFrame';
import HeadBlock from '../../views/HeadBlock';

export default class Read extends Component {
  constructor(props) {
    // const { match } = props;
    super(props);

    this.stream = readStore(props);

    this.state = { ...this.stream.state };
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }
  }

  componentDidMount() {
    this._sub = this.stream.subscribe((s) => {
      this.setState(s.value);
    }, (err) => {
      console.log('beta stream error: ', err);
    }, () => {
      if (this.unlisten) {
        this.unlisten();
        this.unlisten = null;
      }
    });

    this.unlisten = this.props.history.listen((location, action) => {
      // location is an object like window.location
      console.log('....history change: ', action, location.pathname, location.state);
      if (this.mounted) {
        this.stream.do.setPathname(location.pathname);
      }
    });
  }

  render() {
    const { title, content } = this.state;
    return (
      <PageFrame>
        <HeadBlock>
          <h1>{title || '...'}</h1>
        </HeadBlock>
      </PageFrame>
    );
  }
}
