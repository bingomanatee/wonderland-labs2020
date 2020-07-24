import React, { PureComponent, useState } from 'react';
import {
  Button, DropButton, ResponsiveContext, Box,
} from 'grommet';
import _ from 'lodash';
import styled from 'styled-components';
import NavGrid from './NavGrid';
import MenuButton from '../../views/MenuButton';
import PageCarrot from '../../views/PageCarrot';
import siteStore from '../../store/site.store';
import navStream from '../../store/nav.store';
import encodePath from '../../utils/encodePath';

const CAT_RE = /cat\/([^/]+)/;
const ART_RE = /read\/(.*)/;
const ARTICLE_SUFFIX = /\/[^/.]+\.md$/;

const MenuButtonSmall = (props) => {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onClick={props.onClick}
      align="center"
      direction="row"
      background={hover ? 'white' : 'rgba(0,0,0,0.125)'}
      className={hover ? 'elevated' : ''}
      pad={{
        left: '0.5rem', right: '0.25rem', top: '3px', bottom: '3px',
      }}
      margin={{
        left: '0.5rem', top: '0.25rem', bottom: '0.25rem', right: '0.5rem',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      gap="small"
      round="4px"
      wrap={false}
    >
      <div>
        {props.children}
      </div>
      <PageCarrot hover={hover} />
    </Box>
  );
};

const NavButton = (props) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      const Container = (size === 'large') ? MenuButton : MenuButtonSmall;
      return (
        <Container {...props} />
      );
    }}
  </ResponsiveContext.Consumer>
);

export default class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...siteStore.value, category: navStream.my.category, location: _.get(props, 'history.location.pathname') };
    if (this.unlisten) {
      this.unlisten();
    }
    this.stream = siteStore;
  }

  componentDidMount() {
    this.mounted = true;

    this.unlisten = this.props.history.listen((location, action) => {
      // location is an object like window.location
      if (this.mounted) {
        this.setState({ location: _.get(location, 'pathname', '') });
      }
    });

    this._sub = this.stream.subscribe((s) => {
      if (this.mounted) {
        this.setState(s.value);
      }
    }, (e) => {
      console.log('error in stream', e);
    }, () => {
      this.unlisten();
      this.unlisten = null;
    });

    this._nsub = navStream.subscribe((s) => {
      this.setState({ category: s.my.category });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this._sub.unsubscribe();
    this._nsub.unsubscribe();
  }

  render() {
    const { history } = this.props;
    const { categories, location, account } = this.state;

    let pathname = location;
    if (location) {
      if (CAT_RE.test(location)) {
        pathname = decodeURIComponent(CAT_RE.exec(location)[1]);
      } else if (ART_RE.test(location)) {
        pathname = decodeURIComponent(ART_RE.exec(location)[1]);
        pathname = pathname.replace(ARTICLE_SUFFIX, '');
      }
    }
    return (
      <NavGrid>
        <NavButton selected={!pathname || (pathname === '/')} onClick={() => history.push('/')}>
          Home
        </NavButton>
        {_(categories).filter('published').map((cat) => (
          <NavButton selected={_.get(cat, 'directory') === pathname} key={cat.directory} onClick={() => history.push(`/cat/${encodePath(cat.directory)}`)}>
            {cat.title}
          </NavButton>
        )).value()}
        {(siteStore.do.isAdmin()) && (
        <NavButton onClick={() => history.push('/create')}>
          Create an Article
        </NavButton>
        )}
      </NavGrid>
    );
  }
}
