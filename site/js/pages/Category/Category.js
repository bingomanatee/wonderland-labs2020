import React, { PureComponent } from 'react';
import { ResponsiveContext, Text } from 'grommet';
import _ from 'lodash';
import PageFrame from '../../views/PageFrame';
import HeadBlock from '../../views/HeadBlock';
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
              <HeadBlock size={size}>
                <h1>{_.get(category, 'title', '...')}</h1>
                <Text>
                  {_.get(category, 'content', '...')}
                </Text>
              </HeadBlock>
              <CategoryGrid>
                {_(articles)
                  .filter('published')
                  .sortBy(({ updated_at }) => {
                    const d = parseRD(updated_at);
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
