import React, { useState } from 'react';

function SvgMenubutton(props) {
  const [hover, setHover] = useState(false);
  return (
    <svg width="210px" height="70px" viewBox="0 0 210 70">
      <title>menu button</title>
      <desc>Created with Sketch.</desc>
      <g
        id="menu-button"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={() => { if (props.onClick) props.onClick(); }}
      >
        <g id="Group-9" transform="translate(-31.000000, 0.000000)">
          <path
            d="M181.599497,60.0000719 L181.526583,59.9280576 L15.8114286,59.9280576 C9.85005714,59.9280576 5,55.0708633 5,49.1007194 L5,20.8992806 C5,14.9291367 9.85005714,10.0719424 15.8114286,10.0719424 L181.526583,10.0719424 L181.599497,9.99992806 C188.178377,3.55136691 196.862217,0 206.051429,0 C225.32192,0 241,15.7011511 241,35 C241,54.2988489 225.32192,70 206.051429,70 C196.862217,70 188.178377,66.4486331 181.599497,60.0000719 Z"
            id="Fill-1"
            fillOpacity={0.468449519}
            fill={hover ? 'black' : '#020202'}
          />
          <path
            d="M183.766842,55.0001681 L183.691891,54.9159664 L5.78484848,54.9159664 C2.59513333,54.9159664 0,52.3147899 0,49.1176471 L0,20.8823529 C0,17.6852101 2.59513333,15.0840336 5.78484848,15.0840336 L183.691891,15.0840336 L183.766842,14.9998319 C189.443036,8.64487395 197.572006,5 206.069697,5 C222.573618,5 236,18.4576471 236,35 C236,51.5423529 222.573618,65 206.069697,65 C197.572006,65 189.443036,61.3551261 183.766842,55.0001681 Z"
            id="Fill-5"
            fill={hover ? 'white' : 'rgba(255,255,255,0.8)'}
          />
          <text
            id="REACT-APPS"
            fontFamily="Franca-Bold, Helvetica Neue, sans-serif"
            fontSize={24}
            fontStyle="condensed"
            fontWeight="bold"
            fill="#000000"
          >
            <tspan x={54.888} y={43}>
              {props.children}
            </tspan>
          </text>
        </g>
        <polygon
          id="Path"
          fill="#000000"
          points="167 16.2006957 196.4527 34.8932991 167 53.9739084 179.99363 34.8932991"
        />
      </g>
    </svg>
  );
}

export default SvgMenubutton;
