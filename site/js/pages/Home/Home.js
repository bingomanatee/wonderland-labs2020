import React, { PureComponent } from 'react';
import { ResponsiveContext } from 'grommet';
import _ from 'lodash';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';
import ArticleLink from '../../views/ArticleLink';
import HomeGrid from './HomeGrid';
import parseRD from '../../utils/parseRD';

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
    this._nsub.unsubscribe();
  }

  render() {
    const articles = this.stream.my.homepageArticles;
    const { history } = this.props;
    return (
      <PageFrame>
        <ResponsiveContext.Consumer>
          {(size) => (
            <HomeGrid>
              {_(articles)
                .filter('published')
                .sortBy(({ fileRevised }) => {
                  const d = parseRD(fileRevised);
                  return d ? d.valueOf() : 0;
                })
                .reverse()
                .map(
                  (article) => (
                    <ArticleLink
                      currentArticle={this.state.article}
                      size={size}
                      category={siteStore.do.catForArticle(article)}
                      history={history}
                      key={article.path}
                      article={article}
                    />
                  ),
                )
                .value()}
            </HomeGrid>
          )}
        </ResponsiveContext.Consumer>
      </PageFrame>
    );
  }
}
