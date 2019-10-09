import React from 'react';
import { Grid, ResponsiveContext, Box } from 'grommet';
import _ from 'lodash';

export default ({ children, world }) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {
        case 'small':
        case 'medium':

          return (
            <Grid
              columns={[['2rem', '4rem'], 'auto', '2rem', '4px']}
              rows={['2rem', ['3rem', '1fr'], ['3rem', '1fr']]}
              gap="none"
              pad="2px"
              margin="small"
              className="brush-frame"
              areas={[
                { name: 'label', start: [0, 0], end: [3, 0] },
                { name: 'label-op', start: [0, 1], end: [0, 1] },
                { name: 'control-op', start: [1, 1], end: [1, 1] },
                { name: 'value-op', start: [2, 1], end: [2, 1] },
                { name: 'label-radius', start: [0, 2], end: [0, 2] },
                { name: 'control-radius', start: [1, 2], end: [1, 2] },
                { name: 'value-radius', start: [2, 2], end: [2, 2] },
              ]}
            >
              <Box gridArea="label" className="panel-label">Brush</Box>
              {children}
            </Grid>
          );

          break;

        default:
          return (
            <Grid
              columns={['auto']}
              rows={['2rem', ['3rem', '1fr'], ['3rem', '1fr'], ['3rem', '1fr'], ['3rem', '1fr'], ['3rem', '1fr'], ['3rem', '1fr']]}
              gap="none"
              pad="2px"
              margin="small"
              className="brush-frame"
              areas={[
                { name: 'label', start: [0, 0], end: [0, 0] },
                { name: 'label-op', start: [0, 1], end: [0, 1] },
                { name: 'control-op', start: [0, 2], end: [0, 2] },
                { name: 'value-op', start: [0, 3], end: [0, 3] },
                { name: 'label-radius', start: [0, 4], end: [0, 4] },
                { name: 'control-radius', start: [0, 5], end: [0, 5] },
                { name: 'value-radius', start: [0, 6], end: [0, 6] },
              ]}
            >
              <Box gridArea="label" className="panel-label">Brush</Box>
              {children}
            </Grid>
          );
      }
    }}
  </ResponsiveContext.Consumer>
);
