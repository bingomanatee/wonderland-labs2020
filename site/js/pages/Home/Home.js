import React, { PureComponent } from 'react';
import { List, Box, ResponsiveContext } from 'grommet';
import _ from 'lodash';
import styled from 'styled-components';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';
import forSize from '../../utils/forSize';

const Headline = styled.h2`
  font-size: ${({ size }) => forSize(size, '1rem', '1.33rem')};
  font-family: ${({ size }) => forSize(size, '"Walbaum12pt-SemiBold"', '"Walbaum18pt-Medium"')}, "Helvetica Neue", Helvetica, sans-serif;
  color: black;
  padding: 0.5rem 2rem;
  line-height: 120%;
  font-weight: bold;
  margin: 0;
   text-shadow:
   -1px -1px 0 rgba(255,255,255,0.25),
    1px -1px 0 rgba(255,255,255,0.25),
    -1px 1px 0 rgba(255,255,255,0.25),
     1px 1px 0 rgba(255,255,255,0.25);

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
`;

const ArticleHead = ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) => <Headline size={size}>{children}</Headline>}
  </ResponsiveContext.Consumer>
);

const ArticleBack = styled.div`
  padding: 0.25rem;
  border-radius:  ${({ size }) => forSize(size, 0, '2px', '0.5rem')}
  background-color:  ${({ size }) => forSize(size, 'rgba(255,255,255,0.125)', 'rgba(255,255,255,0)')};
  ${({ size }) => forSize(size, '', `-webkit-box-shadow: inset 0px 0px 20px -5px rgba(255,255,255,0.25);
  -moz-box-shadow: inset 0px 0px 20px -5px rgba(255,255,255,0.25);
  box-shadow: inset 0px 0px 20px -5px rgba(255,255,255,0.25);`)}
&:hover {
  background-color: rgba(255,255,255,0.85);
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
`;

const Grid = styled.nav`
  display: grid;
  grid-template-columns: ${({ size }) => forSize(size, '[col] auto', '[col] 1fr [col] 1fr', '[col] 1fr [col] 1fr [col] 1fr')};
  grid-auto-rows: ${({ size }) => forSize(size, 'auto')};
  grid-column-gap: ${({ size }) => forSize(size, 0, '0.25rem', '0.5rem')};
  grid-row-gap: ${({ size }) => forSize(size, '0.25rem', '0.5rem')};
`;
const HomeGrid = ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) => <Grid size={size}>{children}</Grid>}
  </ResponsiveContext.Consumer>
);

function articleStyle(article, size) {
  if (size === 'small') return {};
  if (_.get(article, 'title.length', 0) > 40) {
    return {
      gridColumn: ' span 2',
    };
  }
  return {};
}

export default class Home extends PureComponent {
  constructor(p) {
    super(p);
    this.stream = siteStore;
    this.state = { ...siteStore.value };
  }

  componentDidMount() {
    this.mounted = true;
    this._sub = this.stream.subscribe((s) => {
      if (this.mounted) {
        this.setState(s.value);
      }
    }, (e) => {
      console.log('error in stream', e);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const articles = this.stream.my.homepageArticles;
    return (
      <PageFrame>
        <ResponsiveContext.Consumer>
          {(size) => (
            <HomeGrid>
              {articles.map(
                (article) => (
                  <ArticleBack
                    size={size}
                    onMouseLeave={() => navStream.do.setArticle(null)}
                    onMouseEnter={() => navStream.do.setArticle(article)}
                    style={articleStyle(article, size)}
                  >
                    <ArticleHead>{article.title}</ArticleHead>
                  </ArticleBack>
                ),
              )}
            </HomeGrid>
          )}
        </ResponsiveContext.Consumer>
      </PageFrame>
    );
  }
}
