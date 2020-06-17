import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import parseRD from '../utils/parseRD';
import forSize from '../utils/forSize';

const YEAR = dayjs().year();

const ArticleDateWrapper = styled.div`
  font-size: ${({ size }) => forSize(size, '0.8rem', '1rem')};
  color: rgb(72,0,0);
  padding: 2px;
  font-weight: normal;
  text-shadow: none;
`;
const ArticleDate = ({ fileRevised, size }) => {
  const d = parseRD(fileRevised);
  if (!d) return '';
  let dateString = `[d.${d.format('D')}.m.${d.format('M')}.y.${d.format('YYYY')}]`;
  if (d.year() !== YEAR) {
    dateString = `[m.${d.format('M')}.y.${d.format('YYYY')}]`;
  }
  return (
    <ArticleDateWrapper size={size}>
      {dateString}
    </ArticleDateWrapper>
  );
};

export default ArticleDate;
