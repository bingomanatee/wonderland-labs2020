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
    this.state = { ...siteStore.value, category: navStream.my.category };
    this.stream = siteStore;
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
    const { categories, category } = this.state;
    return (
      <NavGrid>
        <NavButton onClick={() => history.push('/')}>
          Home
        </NavButton>
        {_(categories).filter('published').map((cat) => (
          <NavButton selected={_.get(category, 'directory') === cat.directory} key={cat.directory} onClick={() => history.push(`/cat/${encodePath(cat.directory)}`)}>
            {cat.title}
          </NavButton>
        )).value()}
      </NavGrid>
    );
  }
}
