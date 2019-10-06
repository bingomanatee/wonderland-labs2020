import React from 'react';
import {Grid, ResponsiveContext} from 'grommet';

export default ({children}) => {
  return <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {

        default:
          return <Grid
            rows={['8rem', '1fr', '1fr']}
            columns={['auto', '10rem']}
            gap="none"
            pad="none"
            fill={true}
            className="world-frame"
            areas={[
              {name: 'header', start: [0, 0], end: [1, 0]},
              {name: 'panel-one', start: [1, 1], end: [1, 1]},
              {name: 'panel-two', start: [1, 2], end: [1, 2]},
              {name: 'editor', start: [0, 1], end: [0, 2]}
            ]}
          >{children}</Grid>;
      }
    }}
  </ResponsiveContext.Consumer>
}
