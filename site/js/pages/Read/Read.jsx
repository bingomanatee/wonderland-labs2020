import {
  Text, TextInput, Box, Button, ResponsiveContext,
} from 'grommet';
import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';

import readStore from './read.store';
import PageFrame from '../../views/PageFrame';
import HeadBlock from '../../views/HeadBlock';
import ArticleDate from '../../views/ArticleDate';
import Category from '../../views/Category';
import stateStream from '../../store/site.store';

const BodyBlock = styled.article`
  margin: 2rem;
  padding: 0.5rem 1.5rem;
  background-color: rgba(255,255,255,0.75);
  border-radius: 1rem;
  line-height: 120%;
  -webkit-box-shadow: 0px 0px 2rem 2rem rgba(255,255,255,0.75);
  -moz-box-shadow: 0px 0px 2rem 2rem rgba(255,255,255,0.75);
  box-shadow: 0px 0px 2rem 2rem rgba(255,255,255,0.75);
  h1, h2, h3, h4, h5 {
    line-height: 140%;
  }
`;

const ReactMarkdown = require('react-markdown');
const htmlParser = require('react-markdown/plugins/html-parser');

// See https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
// for more info on the processing instructions
const parseHtml = htmlParser({
  isValidNode: (node) => node.type !== 'script',
  processingInstructions: [/* ... */],
});

export default class Read extends Component {
  constructor(props) {
    // const { match } = props;
    super(props);

    this.stream = readStore(props);

    this.state = { ...this.stream.state };
  }

  componentWillUnmount() {
    this._sub.unsubscribe();
    this._siteSub.unsubscribe();
    if (this.unlisten) this.unlisten();
  }

  componentDidMount() {
    this._sub = this.stream.subscribe((s) => {
      this.setState(s.value);
    }, (err) => {
      console.log('read stream error: ', err);
    }, () => {
      if (this.unlisten) {
        this.unlisten();
        this.unlisten = null;
      }
    });

    this._siteSub = stateStream.subscribe((s) => {
      this.setState({
        account: s.my.account,
        isAdmin: s.do.isAdmin(),
      });
    });

    this.unlisten = this.props.history.listen((location, action) => {
      // location is an object like window.location
      // console.log('....history change: ', action, location.pathname, location.state);
      if (this.mounted) {
        this.stream.do.setPathname(location.pathname);
      }
    });
  }

  render() {
    const {
      title, content, category, isAdmin,
    } = this.state;
    return (

      <ResponsiveContext.Consumer>
        {(size) => (
          <PageFrame>
            <HeadBlock>
              <h1>{title || '...'}</h1>

            </HeadBlock>
            <BodyBlock className="blurBehindMore">
              <Box direction="row" justify="between" gap="large">
                {category ? <Category size={size}>{category.title}</Category> : ''}
                <ArticleDate {...this.state} size={size} />
              </Box>
              <ReactMarkdown
                source={content}
                escapeHtml={false}
                astPlugins={[parseHtml]}
              />
              <hr />
              <Box direction="row" justify="between" gap="large">
                <Button onClick={this.stream.do.goCat} plain={false}>
                  View more articles in the
                  {[
                    ' ',
                    <span key="q1">&quot;</span>,
                    `${_.get(category, 'title', '...')}`,
                    <span key="q2">&quot;</span>,
                    ' ',
                  ]}
                  section
                </Button>
                <Button primary onClick={this.stream.do.goHome} main plain={false}>Go Home</Button>
                {isAdmin && <Button onClick={this.stream.do.goEdit} plain={false}>Edit Article</Button>}
              </Box>
            </BodyBlock>
          </PageFrame>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
