import React from 'react';

const SvgColorPip = ({ active }) => (
  <svg width="1em" height="1em" viewBox="0 0 21 21">
    <g fill="none" fillRule="evenodd">
      <circle fill={active ? '#000' : 'rgba(0,0,0,0)'} cx={10.5} cy={10.5} r={10.5} />
      <circle fill="currentColor" cx={10.5} cy={10.5} r={6.5} />
    </g>
  </svg>
);

export default SvgColorPip;
