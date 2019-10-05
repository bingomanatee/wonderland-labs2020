import styled from 'styled-components';
import React, { PureComponent } from 'react';

const SiteHeaderView = styled.header`
  `;

const LOGO_SCALE = 48 / 300;
const logoStyle = { width: 800, height: 300 };
logoStyle.width *= LOGO_SCALE;
logoStyle.height *= LOGO_SCALE;

export default class SiteHeader extends PureComponent {
  render() {
    return (
      <>
        <SiteHeaderView className="page-header">
          <div className="logo">
            <img src="/img/logo-large.png" style={logoStyle} />
            Hexworld
          </div>
          <nav>
            <span className="nav-space" />
            <a href="/logout">User "Fred Smith"</a>
          </nav>
        </SiteHeaderView>
        <SiteHeaderView className="page-header page-header-subhead">
          Subheader
        </SiteHeaderView>
      </>

    );
  }
}
