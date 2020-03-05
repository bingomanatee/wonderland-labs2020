import React, { PureComponent } from 'react';
import { List, Box, ResponsiveContext } from 'grommet';
import _ from 'lodash';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';
import forSize from '../../utils/forSize';
import PageCarrot from '../../views/PageCarrot';

const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

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

function parseRD(fileRevised) {
  if (!fileRevised) return null;
  const d = dayjs(fileRevised);
  if (!d.isValid()) return null;
  return d;
}

const ArticleDateWrapper = styled.div`
  font-size: ${({ size }) => forSize(size, '0.8rem', '1rem')};
  color: rgb(72,0,0);
  padding: 2px;
  font-weight: normal;
  text-shadow: none;
`;

const YEAR = dayjs().year()

const ArticleDate = ({ fileRevised, size }) => {
  const d = parseRD(fileRevised);
  console.log('fileRevised:', fileRevised, 'd', d);
  if (!d) return '';
  let dateString = `[d.${d.format('D')}.m.${d.format('M')}.y.${d.format('YYYY')}]`
  if (d.year() !== YEAR) {
    dateString = `[y.${d.format('YYYY')}]`;
  }
  return (
    <ArticleDateWrapper size={size}>
      {dateString}
    </ArticleDateWrapper>
  );
};

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

function articleStyle(article, size) {
  if (size === 'small') return {};
  if (_.get(article, 'title.length', 0) > forSize(size, 10000, 30, 40)) {
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
    this.state = { ...siteStore.value, article: navStream.my.article };
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

    this._nsub = navStream.subscribe((n) => {
      this.setState({ article: n.my.article });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this._sub.unsubscribe();
  }

  render() {
    const articles = this.stream.my.homepageArticles;
    return (
      <PageFrame>
        <ResponsiveContext.Consumer>
          {(size) => (
            <HomeGrid>
              {_.sortBy(articles, ({ fileRevised }) => {
                const d = parseRD(fileRevised);
                return d ? d.valueOf() : 0;
              })
                .reverse()
                .map(
                  (article) => (
                    <ArticleBack
                      key={article.path}
                      size={size}
                      onMouseLeave={() => navStream.do.setArticle(null)}
                      onMouseEnter={() => navStream.do.setArticle(article)}
                      style={articleStyle(article, size)}
                    >
                      <ArticleHead>
                        <Box direction="column">
                          {article.title}
                          <ArticleDate {...article} size={size} />
                        </Box>
                        <PageCarrot hover={article === this.state.article} />
                      </ArticleHead>
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
