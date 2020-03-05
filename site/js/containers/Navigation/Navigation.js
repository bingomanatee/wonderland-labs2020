import React, { PureComponent } from 'react';
import {
  Button, DropButton, ResponsiveContext, Box,
} from 'grommet';
import styled from 'styled-components';
import NavGrid from './NavGrid';
import MenuButton from './../../views/MenuButton';

const NavItem = styled.div`
margin-top: 1rem;
margin-right: 1rem;
margin-left: -1px;
`;

const NavItemSmall = styled.div`
margin: 2px;
height: 2rem;
`;
const NavButtonInner = styled(Button)`
text-align: center;
`;

const NavButton = (props) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      const Container = (size === 'large') ? NavItem : NavItemSmall;
      return (
        <Container>
          <NavButtonInner {...props} plain={false} fill>
            {props.children}
          </NavButtonInner>
        </Container>
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
        <MenuButton onClick={() => history.push('/')}>
          Home
        </MenuButton>
        <MenuButton onClick={() => history.push('/beta')}>
          Beta
        </MenuButton>
      </NavGrid>
    );
  }
}
