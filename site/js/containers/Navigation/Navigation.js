import React, { PureComponent } from 'react';

export default class Navigation extends PureComponent {
  render() {
    const { history } = this.props;
    return (
      <nav id="leftnav">
        <div onClick={() => history.push('/')}>
        Home
        </div>
        <div onClick={() => history.push('/alpha')}>
          Alpha
        </div>
        <div onClick={() => history.push('/beta')}>
          Beta
        </div>
      </nav>
    );
  }
}
