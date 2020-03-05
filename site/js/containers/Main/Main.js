import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Grommet, Grid, Box, Stack,
} from 'grommet';

import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';

import MainGrid from './MainGrid';
import './main.css';
// pages

import Home from '../../pages/Home';
import Beta from '../../pages/Beta';
import theme from '../../theme';
import Background from '../Background';

export default class Main extends PureComponent {
  render() {
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
                    <Route path="/beta" exact component={Beta} />
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
