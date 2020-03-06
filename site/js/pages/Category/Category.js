import React, { PureComponent } from 'react';
import { ResponsiveContext } from 'grommet';
import _ from 'lodash';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';
import ArticleLink from '../../views/ArticleLink';
import CategoryGrid from './CategoryGrid';
import parseRD from '../../utils/parseRD';
import categoryStore from './category.store';

export default class Category extends PureComponent {
  constructor(p) {
    super(p);
    this.stream = categoryStore;
    this.state = { ...categoryStore.value, article: navStream.my.article, path: _.get(p, 'match.params.path') };
  }

  componentDidMount() {
    this.mounted = true;
    this._sub = this.stream.subscribe((s) => {
      if (this.mounted) {
        this.setState(s.value);
        console.log('---- category.category = ', s.my.category);
        navStream.do.setCategory(s.my.category);
      }
    }, (e) => {
      console.log('error in stream', e);
    });

    this._nsub = navStream.subscribe((n) => {
      this.setState({ article: n.my.article });
    });

    this.stream.do.loadCategoryArticles(this.state.path);
  }

  componentDidUpdate(prevProps) {
    const path = _.get(this.props, 'match.params.path');
    if (path !== this.state.path) {
      this.setState({ path }, () => {
        console.log('--- updating with path ', path);
        this.stream.do.loadCategoryArticles(path);
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this._sub.unsubscribe();
    this._nsub.unsubscribe();
  }

  render() {
    const { articles, category } = this.state;
    const { history } = this.props;
    return (
      <PageFrame>
        <ResponsiveContext.Consumer>
          {(size) => (
            <>
              <h1>{_.get(category, 'title', '...')}</h1>
              <p>
                {_.get(category, 'content', '...')}
              </p>
              <CategoryGrid>
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
                        history={history}
                        key={article.path}
                        article={article}
                      />
                    ),
                  )
                  .value()}
              </CategoryGrid>
            </>
          )}
        </ResponsiveContext.Consumer>
      </PageFrame>
    );
  }
}
