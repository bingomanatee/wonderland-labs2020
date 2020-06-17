import { Box, ResponsiveContext } from 'grommet';
import styled from 'styled-components';
import _ from 'lodash';
import React from 'react';
import dayjs from 'dayjs';
import forSize from '../utils/forSize';
import PageCarrot from './PageCarrot';
import navStream from '../store/nav.store';
import parseRD from '../utils/parseRD';
import encodePath from '../utils/encodePath';
import ArticleDate from '../views/ArticleDate';
import Category from '../views/Category';

const SHADOW_INSET_COLOR = 'rgba(255,255,255,0.5)';

const textShadowColor = (size) => `rgba(204,204,204,${forSize(size, 0, 0.25, 0.5)})`;

const Headline = styled.h2`
  font-size: ${({ size }) => forSize(size, '1rem', '1.33rem')};
  font-family: Franco, "Helvetica Neue", Helvetica, sans-serif;
  color: black;
  padding: 0.5rem 1rem;
  line-height: 120%;
  font-weight: 800;
  margin: 0;
   ${({ size }) => forSize(size, '', `text-shadow:
   -1px -1px 1px ${textShadowColor(size)},
    1px -1px 1px ${textShadowColor(size)},
    -1px 1px 1px ${textShadowColor(size)},
     1px 1px 1px ${textShadowColor(size)}`)};

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

function articleStyle(article, size) {
  if (size === 'small') return {};
  if (_.get(article, 'title.length', 0) > forSize(size, 10000, 30, 40)) {
    return {
      gridColumn: ' span 2',
    };
  }
  return {};
}

const ArticleHead = ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) => <Headline size={size}>{children}</Headline>}
  </ResponsiveContext.Consumer>
);

const ArticleBack = styled.div`
  padding: 0.25rem;
  border-radius:  ${({ size }) => forSize(size, 0, '2px', '0.5rem')}
  background-color:  ${({ size }) => forSize(size, 'rgba(255,255,255,0.125)', 'rgba(255,255,255,0)')};
  ${({ size }) => forSize(size, '', `-webkit-box-shadow: inset 0px 0px 20px -5px ${SHADOW_INSET_COLOR};
  -moz-box-shadow: inset 0px 0px 20px -5px ${SHADOW_INSET_COLOR};
  box-shadow: inset 0px 0px 20px -5px ${SHADOW_INSET_COLOR};`)}
&:hover {
  background-color: rgba(255,255,255,0.85);
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
`;

export default ({
  article, size, history, category, currentArticle,
}) => (
  <ArticleBack
    size={size}
    onMouseLeave={() => navStream.do.setArticle(null)}
    onMouseEnter={() => navStream.do.setArticle(article)}
    onClick={() => history.push(`/read/${encodePath(article.path)}`)}
    style={articleStyle(article, size)}
  >
    <ArticleHead>
      <Box direction="column">
        {article.title}
        {category ? <Category size={size}>{category.title}</Category> : ''}
        <ArticleDate {...article} size={size} />
      </Box>
      <PageCarrot hover={article === currentArticle} />
    </ArticleHead>
  </ArticleBack>
);
