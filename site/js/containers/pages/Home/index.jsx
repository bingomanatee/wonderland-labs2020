import React, { PureComponent } from 'react';
import { login } from '../../store';
import LoginDialog from './LoginDialog';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...login.state };
  }

  componentDidMount() {
    this._sub = login.subscribe(({ state }) => this.setState(state),
      (err) => {
        console.log('login store error: ', err);
      });
  };

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  render() {
    const { isLoggedIn, userName } = this.state;
    return (
      <article className="content">
        <h1>Home</h1>
        {isLoggedIn ? <p>Welcome <b>{userName}</b></p> : <LoginDialog/>}
      </article>
    );
  }
}
