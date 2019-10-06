import {Grid, ResponsiveContext} from "grommet/es6";
import React from "react";

export default ({children}) => {
  return <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {
        case 'small':
          return <Grid
            columns={['auto']}
            rows={['auto', 'auto', 'auto', 'auto', 'auto', 'auto']}
            gap="medium"
            areas={[
              {
                name: 'name-label',
                start: [0, 0],
                end: [0, 0]
              },
              {
                name: 'name-field',
                start: [0, 1],
                end: [0, 1]
              },
              {
                name: 'resolution-label',
                start: [0, 2],
                end: [0, 2]
              },
              {
                name: 'resolution-field',
                start: [0, 3],
                end: [0, 3]
              },
              {
                name: 'buttons',
                start: [0, 4],
                end: [0, 4]
              }
            ]}
          >{children}</Grid>
          break;

        default:
          return <Grid
            columns={['10rem', ['10rem', '30rem']]}
            rows={["auto", 'auto', 'auto']}
            gap="medium"
            areas={[
              {
                name: 'name-label',
                start: [0, 0],
                end: [0, 0]
              },
              {
                name: 'name-field',
                start: [1, 0],
                end: [1, 0]
              },
              {
                name: 'resolution-label',
                start: [0, 1],
                end: [0, 1]
              },
              {
                name: 'resolution-field',
                start: [1, 1],
                end: [1, 1]
              },
              {
                name: 'buttons',
                start: [0, 2],
                end: [1, 2]
              }
            ]}
          >{children}</Grid>
      }
    }
    }
  </ResponsiveContext.Consumer>
}
