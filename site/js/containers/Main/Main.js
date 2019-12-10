import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grommet, Grid, Box } from 'grommet';

import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';

import MainGrid from './MainGrid';

// pages

import Home from '../pages/Home';
import Beta from '../pages/Beta';
import theme from '../../theme';

export default class Main extends PureComponent {

  render() {
    return (
      <main>
        <Grommet theme={theme} full>
          <MainGrid>
            <Box gridArea="header">
              <SiteHeader />
            </Box>
            <Box gridArea="nav">
              <Navigation />
            </Box>
            <Box gridArea="main">
              <Content>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/beta" exact component={Beta} />
                  <Route component={Home} />
                </Switch>
              </Content>
            </Box>
          </MainGrid>
        </Grommet>
      </main>
    );
  }
}
