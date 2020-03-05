import React, { PureComponent, useState } from 'react';
import {
  Button, DropButton, ResponsiveContext, Box,
} from 'grommet';
import styled from 'styled-components';
import NavGrid from './NavGrid';
import MenuButton from '../../views/MenuButton';
import PageCarrot from '../../views/PageCarrot';

const MenuButtonSmall = (props) => {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onClick={props.onClick}
      align="center"
      direction="horizontal"
      background={hover ? 'white' : 'rgba(0,0,0,0.125)'}
      className={hover ? 'elevated' : ''}
      pad="2px"
      margin={{ left: '0.5rem', top: '0.25rem', bottom: '0.25rem' , right: '0.5rem' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      gap="small"
      round="4px"
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
  }

  render() {
    const { history } = this.props;
    return (
      <NavGrid>
        <NavButton onClick={() => history.push('/')}>
          Home
        </NavButton>
        <NavButton onClick={() => history.push('/beta')}>
          Beta
        </NavButton>
      </NavGrid>
    );
  }
}
