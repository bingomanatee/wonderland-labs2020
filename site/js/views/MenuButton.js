import React, { useState } from 'react';

function SvgMenubutton(props) {
  const [hover, setHover] = useState(false);
  return (
    <svg
      data-name="MenuButton"
      viewBox="0 0 237 90"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => { if (props.onClick) props.onClick(); }}
    >
      <defs>
        <filter id="menuItemShadow">
          <feDropShadow floodColor="black" floodOpacity="1" dx="5" dy="5" stdDeviation="2" />
        </filter>
      </defs>

      <g
        id="offset"
        style={{
          opacity: props.selected ? 1 : 0,
          fill: props.selected ? 'rgb(255,204,0)' : '',
        }}
      >
        <path
          d="M185.25,79.17a38.59,38.59,0,0,1-23.09-7.59,18.29,18.29,0,0,0-10.89-3.71H-8.59V12.63H151a18.63,18.63,0,0,0,11.11-3.7,38.56,38.56,0,0,1,23.1-7.6c.52,0,1,0,1.55,0a39.12,39.12,0,0,1,37.33,37.06,38.92,38.92,0,0,1-38.88,40.75Z"
        />
      </g>
      <g
        data-id="body"
        style={{
          filter: hover ? 'url(#menuItemShadow)' : '',
        }}
      >
        <path
          d="M186.61,6.35A33.81,33.81,0,0,0,165.12,13,23.73,23.73,0,0,1,151,17.63H-3.59V62.87H151.27a23.34,23.34,0,0,1,13.86,4.69A33.92,33.92,0,1,0,186.61,6.35Z"
          style={{
            fill: hover ? 'white' : 'rgba(0,0,0,0.125)',
          }}
        />
      </g>
      <text
        data-id="text"
        transform="translate(146.32 47.82)"
        style={{
          fontSize: 21,
          fontFamily: 'Franca-SemiBold, Franca',
          fontWeight: 600,
          textAnchor: 'end',
        }}
      >
        {props.children}
      </text>
      <polyline
        id="arrow"
        points="184 28 198 42 184 56"
        style={{
          fill: 'none',
          stroke: hover ? 'black' : 'white',
          strokeLinecap: 'round',
          strokeMiterlimit: 10,
          strokeWidth: 4,
        }}
      />
    </svg>
  );
}

export default SvgMenubutton;
