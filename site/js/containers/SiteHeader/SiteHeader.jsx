import React, { PureComponent } from 'react';
import {
  Box, Text, Button, ResponsiveContext,
} from 'grommet';
import styled from 'styled-components';
import './SiteHeader.css';
import forSize from '../../utils/forSize';

const SiteHeaderGrid = styled.section`
width:100%;
display: grid;
grid-template-columns: ${({ size }) => forSize(size, '[first-col-start] 1fr  [first-col-end]',
    '[first-col-start] auto [user] 1fr [first-col-end]')};
grid-template-rows:  ${({ size }) => forSize(size, '[first-row-start] auto [user] auto [second-row-end]',
    '[first-row-start] auto [first-row-end]')};
padding-left: 1rem;
padding-right: 1rem;
`;

export default class SiteHeader extends PureComponent {
  render() {
    return (
      <Box
        direction="row"
        gap="medium"
        pad="none"
        align="center"
        alignContent="stretch"
        as="header"
        fill="horizontal"
        className="SiteHeaderContainer"
      >
        <ResponsiveContext.Consumer>
          {(size) => (
            <SiteHeaderGrid size={size}>
              <h1 className={forSize(size, 'small', '')}>Wonderland Labs</h1>
              <Box
                direction="row-reverse"
                className={forSize(size, 'user small', 'user')}
                size={forSize(size, 'small', '')}
                align="center"
              >
                <Button plain href="/logout">User "Fred Smith"</Button>
              </Box>
            </SiteHeaderGrid>
          )}
        </ResponsiveContext.Consumer>

      </Box>
    );
  }
}
