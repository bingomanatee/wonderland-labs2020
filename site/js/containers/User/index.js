import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Logout from './Logout';
import Login from './Login';
import store from '../../store/site.store';
// @TODO: any bindings / hoc

const Frame = styled.div`
padding-right: 3rem;
display: flex;
flex-direction: row;
align-items: center;
justify-content: end;
p {
  font-size: 0.8rem;
  font-weight: bold;
}
`;

export default () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const sub = store.subscribe((store) => {
      if (store.my.account !== account) {
        setAccount(store.my.account);
      }
    });
    return () => sub && sub.unsubscribe();
  }, []);

  if (account) {
    return (
      <Frame title={_.get(account, 'sub', '')}>
        <p>{_.get(account, 'name')}</p>
        <Logout />
      </Frame>
    );
  }
  return (
    <Frame>
      <Login />
    </Frame>
  );
};
