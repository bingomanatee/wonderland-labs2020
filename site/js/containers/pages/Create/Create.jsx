import React from 'react';
import PageFrame from '../../../views/PageFrame';
import {Grid, Text, TextInput, Box, RangeInput, Button} from 'grommet';

export default () => (
  <PageFrame>
    <h1>Create a world</h1>
    <Grid
    columns={['10rem', ['10rem', '30rem']]}
    rows={["auto", 'auto', 'auto']}
    gap="medium"
    areas={[
      {
        name: 'name-label',
        start: [0,0],
        end: [0,0]
      },
      {
        name: 'name-field',
        start: [1, 0],
        end: [1, 0]
      },
      {
        name: 'resolution-label',
        start: [0,1],
        end: [0,1]
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
    >
      <Box gridArea="name-label" direction="row" align="center" alignContent="start">
        <Text align="center">Name    </Text>
      </Box>
      <Box gridArea="name-field" direction="row"  align="center" alignContent="start">
        <TextInput name="name" />
      </Box>
      <Box gridArea="resolution-label" direction="row" align="center" alignContent="start">
        <Text align="center">Resolution    </Text>
      </Box>
      <Box gridArea="resolution-field" direction="row"  align="center" alignContent="start">
        <RangeInput name="resolution" min="20" max="40" step="5" />
      </Box>
      <Box gridArea="buttons" fill={true} direction="row" align="center" alignContent="center" pad="medium">
        <Box fill={false} direction="row" margin="medium" align="center" gap="large" alignContent="center">
          <div>
            <Button primary={true} plain={false}>Create World</Button>
          </div>
          <div>
            <Button plain={false}>Cancel</Button>
          </div>
        </Box>
      </Box>
    </Grid>
  </PageFrame>
)
