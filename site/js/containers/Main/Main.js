import React, {PureComponent} from 'react';
import {Switch, Route} from 'react-router-dom';
import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';
import {Grommet} from 'grommet';

import MainGrid from './MainGrid';

// pages

import Home from '../pages/Home';
import Create from '../pages/Create';
import Beta from '../pages/Home';
import theme from './theme.js';

import {Grid, Box} from 'grommet';

export default class Main extends PureComponent {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <main>
        <Grommet theme={theme} full>
          <MainGrid>
            <Box className="site-header" gridArea="header">
              <SiteHeader/>
            </Box>
            <Box gridArea="nav">
              <Navigation/>
            </Box>
            <Box gridArea="main">
              <Content>
                <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route path="/create" component={Create}/>
                  <Route path="/beta" component={Beta}/>
                  <Route component={Home}/>
                </Switch>
              </Content>
            </Box>
          </MainGrid>
        </Grommet>
      </main>
    );
  }
}
