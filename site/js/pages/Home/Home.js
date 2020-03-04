import React, { PureComponent } from 'react';
import { List, Box } from 'grommet';
import styled from 'styled-components';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';

const ArticleHead = styled.h2`
  font-size: 1.5rem;
  font-family:  "Helvetica Neue", Helvetica, sans-serif;
  color: black;
  padding: 0.5rem 2rem;
  margin: 0;
`;

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
        <List data={articles}>
          {(article) => (
            <Box direction="column" fill="horizontal" onMouseLeave={() => navStream.do.setArticle(null)} onMouseEnter={() => navStream.do.setArticle(article)}>
              <ArticleHead>{article.title}</ArticleHead>
            </Box>
          )}
        </List>
      </PageFrame>
    );
  }
}
