import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Grommet, Grid, Box, Stack,
} from 'grommet';
import Category from '../../pages/Category';

import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';
import siteStore from '../../store/site.store';
import MainGrid from './MainGrid';
import './main.css';

import theme from '../../theme';

// pages

import Home from '../../pages/Home';
import Background from '../Background';
import Read from '../../pages/Read';
import Create from '../../pages/Create';

export default class Main extends PureComponent {
  constructor(p) {
    super(p);
    this.state = { isAdmin: false };
  }

  componentDidMount() {
    this._sub = siteStore.subscribe((s) => this.setState({ isAdmin: s.do.isAdmin() }));
  }

  componentWillUnmount() {
    this._sub.unsubscribe();
  }

  render() {
    const { isAdmin } = this.state;

    return (
      <main>
        <Grommet theme={theme} full>
          <Stack fill interactiveChild="last">
            <Box fill justify="stretch" align="stretch">
              <Background />
            </Box>
            <MainGrid>
              <Box gridArea="header" className="blurBehindMore">
                <SiteHeader />
              </Box>
              <Box gridArea="nav" className="blurBehind">
                <Navigation />
              </Box>
              <Box gridArea="main" className="blurBehind">
                <Content>
                  <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/cat/:path" component={Category} />
                    <Route path="/read/:path" component={Read} />
                    {isAdmin ? <Route path="/create" component={Create} /> : ''}
                    {isAdmin ? <Route path="/edit/:path" component={Create} /> : ''}
                    <Route component={Home} />
                  </Switch>
                </Content>
              </Box>
            </MainGrid>
          </Stack>
        </Grommet>
      </main>
    );
  }
}
