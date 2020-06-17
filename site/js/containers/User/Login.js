import React, { useState } from 'react';

import store from '../../store/site.store';

function SvgLogin() {
  const [hover, setHover] = useState(false);

  return (
    <svg
      width="36px"
      height="34px"
      viewBox="0 0 36 34"
      onClick={store.do.login}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <g
        id="login"
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
        fill={hover ? 'blue' : 'grey'}
      >
        <rect
          id="Rectangle"
          x={0}
          y={29}
          width={36}
          height={15}
          rx={3}
        />
        <circle
          id="Oval"
          cx={17.5}
          cy={15.5}
          r={13.5}
        />
        <rect
          id="Rectangle"
          x={10}
          y={14}
          fill="#FFFFFF"
          width={15}
          height={4}
        />
        <rect
          id="Rectangle"
          fill="#FFFFFF"
          transform="translate(17.500000, 16.000000) rotate(90.000000) translate(-17.500000, -16.000000) "
          x={10}
          y={14}
          width={15}
          height={4}
        />
      </g>
    </svg>
  );
}

export default SvgLogin;
