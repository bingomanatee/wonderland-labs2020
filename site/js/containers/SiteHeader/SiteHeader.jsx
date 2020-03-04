import React, { PureComponent } from 'react';
import { Box, Text, Button } from 'grommet';

export default class SiteHeader extends PureComponent {
  render() {
    return (
      <Box
        direction="row"
        background="rgba(20,20,20,0.3)"
        gap="medium"
        pad="none"
        align="center"
        alignContent="stretch"
        as="header"
        fill="vertical"
        className="SiteHeaderContainer"
        justify="between"
      >
        <h1>Wonderland Labs</h1>
        <Box direction="row-reverse" align="center" className="nav">
          <div style={({ padding: '1rem' })}>
            <Button plain href="/logout">User "Fred Smith"</Button>
          </div>
        </Box>
      </Box>
    );
  }
}
