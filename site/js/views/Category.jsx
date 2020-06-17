import styled from 'styled-components';
import forSize from '../utils/forSize';

const Category = styled.div`
  color: rgba(0,0,0,0.666);
  font-family: Franco, "Helvetica Neue", Helvetica, sans-serif;
  font-size: ${({ size }) => forSize(size, '0.8rem', '1rem')};
  text-shadow: none;
`;

export default Category;
