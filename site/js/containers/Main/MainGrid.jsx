import React from 'react';
import { Grid, ResponsiveContext } from 'grommet';

const largeGrid = (children) => (
  <Grid
    rows={['5rem', '1fr']}
    columns={['15rem', 'auto']}
    gap="none"
    pad="none"
    fill
    areas={[
      { name: 'header', start: [0, 0], end: [1, 0] },
      { name: 'nav', start: [0, 1], end: [0, 1] },
      { name: 'main', start: [1, 1], end: [1, 1] },
    ]}
    className="site-frame"
  >
    {children}
  </Grid>
);

const smallGrid = (children) => (
  <Grid
    rows={['5rem', '1fr', '3rem']}
    columns={['auto']}
    gap="none"
    pad="none"
    fill
    areas={[
      { name: 'header', start: [0, 0], end: [0, 0] },
      { name: 'main', start: [0, 1], end: [0, 1] },
      { name: 'nav', start: [0, 2], end: [0, 2] },
    ]}
    className="site-frame"
  >
    {children}
  </Grid>
);
const medGrid = (children) => (
  <Grid
    rows={['5rem', '3rem', '1fr']}
    columns={['auto']}
    gap="none"
    pad="none"
    fill
    areas={[
      { name: 'header', start: [0, 0], end: [0, 0] },
      { name: 'nav', start: [0, 1], end: [0, 1] },
      { name: 'main', start: [0, 2], end: [0, 2] },
    ]}
    className="site-frame"
  >
    {children}
  </Grid>
);

export default ({ children }) => (

  <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {
        case 'small':
          return smallGrid(children);
          break;

        case 'medium':
          return medGrid(children);
          break;

        case 'large':
          return largeGrid(children);
          break;

        default:
          return largeGrid(children);
      }
    }}
  </ResponsiveContext.Consumer>
);
