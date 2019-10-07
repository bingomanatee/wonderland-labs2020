import React from 'react';
import {Grid, ResponsiveContext} from 'grommet';

export default ({children}) => {
  return <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {

        case 'small':
          return <Grid
            rows={['8rem', 'auto', '12rem', '12rem']}
            columns={['auto']}
            gap="small"
            pad="small"
            fill={true}
            className="world-frame"
            areas={[
              {name: 'header', start: [0, 0], end: [0, 0]},
              {name: 'panel-one', start: [0, 2], end: [0, 2]},
              {name: 'panel-two', start: [0, 3], end: [0, 3]},
              {name: 'editor', start: [0, 1], end: [0, 1]}
            ]}
          >{children}</Grid>;

        break;

        default:
          return <Grid
            rows={['8rem', '1fr', '1fr']}
            columns={['auto', '10rem']}
            gap="small"
            pad="small"
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
