import styled from 'styled-components';
import { ResponsiveContext } from 'grommet';
import React from 'react';
import forSize from '../../utils/forSize';


const Grid = styled.nav`
  display: grid;
  grid-template-columns: ${({ size }) => forSize(size, '[col] auto', '[col] 1fr [col] 1fr', '[col] 1fr [col] 1fr [col] 1fr')};
  grid-auto-rows: ${({ size }) => forSize(size, 'auto')};
  grid-column-gap: ${({ size }) => forSize(size, 0, '0.33rem', '0.5rem', '0.66rem')};
  grid-row-gap: ${({ size }) => forSize(size, '0.25rem', '0.33rem', '0.5rem')};
`;

const HomeGrid = ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) => <Grid size={size}>{children}</Grid>}
  </ResponsiveContext.Consumer>
);

export default HomeGrid;
