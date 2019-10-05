import React, {PureComponent} from 'react';
import {Button, ResponsiveContext} from 'grommet';
import NavGrid from './NavGrid';
import styled from "styled-components";

const NavItem = styled.div`
margin-top: 1rem;
margin-right: 1rem;
margin-left: -1px;
`;

const NavItemSmall = styled.div`
margin: 2px;
`;
const NavButtonInner = styled(Button)`
text-align: center;
`;

const NavButton = (props) => {
  return <ResponsiveContext.Consumer>
    {(size) => {
      const Container = (size === 'small') ? NavItemSmall : NavItem;
      return <Container>
        <NavButtonInner {...props} plain={false}  fill={size !== 'small'} >
          {props.children}
        </NavButtonInner>
      </Container>
    }
    }
  </ResponsiveContext.Consumer>
}


export default class Navigation extends PureComponent {
  render() {
    const {history} = this.props;
    return (
      <NavGrid>
        <NavButton onClick={() => history.push('/')}>
          Home
        </NavButton>
        <NavButton onClick={() => history.push('/alpha')}>
          Alpha
        </NavButton>
        <NavButton onClick={() => history.push('/beta')}>
          Beta
        </NavButton>
      </NavGrid>
    );
  }
}
