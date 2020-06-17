import * as React from 'react';

import { useState } from 'react';
import store from '../../store/site.store';

function SvgLogout() {
  const [hover, setHover] = useState(false);
  return (
    <svg
      width="36px"
      height="34px"
      viewBox="0 0 36 34"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={store.do.logout}
    >
      <g
        id="logout"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <rect
          id="Rectangle"
          fill={hover ? 'lime' : 'black'}
          x={0}
          y={29}
          width={36}
          height={15}
          rx={3}
        />
        <circle
          id="Oval"
          fill={hover ? 'lime' : 'black'}
          cx={17.5}
          cy={15.5}
          r={13.5}
        />
        <rect
          id="Rectangle"
          fill="#FFFFFF"
          transform="translate(17.560660, 15.560660) rotate(45.000000) translate(-17.560660, -15.560660) "
          x={16.5606602}
          y={0.0606601718}
          width={2}
          height={31}
        />
      </g>
    </svg>
  );
}

export default SvgLogout;
