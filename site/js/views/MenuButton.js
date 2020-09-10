import React, { useState } from 'react';

function SvgMenubutton(props) {
  const [hover, setHover] = useState(false);
  return (
    <svg
      data-name="menu-button"
      viewBox="0 0 208 45"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => { if (props.onClick) props.onClick(); }}
      style={{
        marginBottom: '-2px',
      }}
    >
      <defs>
        <filter id="menuItemShadow">
          <feDropShadow floodColor="black" floodOpacity="1" dx="3" dy="3" stdDeviation="2" />
        </filter>
      </defs>
      <path
        id="shadow-offset"
        d="M184,35a17,17,0,0,1-8.15-2.09A7.51,7.51,0,0,0,172.2,32H-17V5H171a6.2,6.2,0,0,0,3.5-1.11A16.9,16.9,0,0,1,184,1h.33A17,17,0,0,1,184,35Z"
        style={{
          opacity: props.selected ? 1 : 0,
          fill: 'black'
        }}
      />
      <g
        id="body"
        style={{
          filter: hover ? 'url(#menuItemShadow)' : '',
        }}
      >
        <path
          id="body"
          d="M184.29,3a14.89,14.89,0,0,0-8.64,2.55A8.23,8.23,0,0,1,171,7H-15V30H172.2a9.54,9.54,0,0,1,4.62,1.16A15,15,0,0,0,199,17.31,15.12,15.12,0,0,0,184.29,3Z"
          style={{
            fill: hover || props.selected ? 'white' : 'rgba(0,0,0,0.125)',
          }}
        />
      </g>
      <polyline
        id="arrow"
        points="184 10 192 18 184 26"
        style={{
          fill: 'none',
          stroke: hover ? 'black' : 'white',
          strokeLinecap: 'round',
          strokeMiterlimit: 10,
          strokeWidth: 4,
        }}
      />
      <text
        data-id="text"
        transform="translate(160, 23)"
        style={{
          fontSize: 18,
          fontFamily: '"Franca-Book", Franca',
          fontWeight: 600,
          textAnchor: 'end',
        }}
      >
        {props.children}
      </text>
    </svg>
  );

  const old = (
    <svg
      data-name="Menu-button"
      viewBox="0 0 227 80"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => { if (props.onClick) props.onClick(); }}
      style={{
        marginBottom: '-4px',
      }}
    >
      <defs>
        <filter id="menuItemShadow">
          <feDropShadow floodColor="black" floodOpacity="1" dx="5" dy="5" stdDeviation="2" />
        </filter>
      </defs>
      <g id="offset">
        <path
          d="M185.25,79.17a38.59,38.59,0,0,1-23.09-7.59,18.29,18.29,0,0,0-10.89-3.71H-8.59V12.63H151a18.63,18.63,0,0,0,11.11-3.7,38.56,38.56,0,0,1,23.1-7.6c.52,0,1,0,1.55,0a39.12,39.12,0,0,1,37.33,37.06,38.92,38.92,0,0,1-38.88,40.75Z"
          style={{
            opacity: props.selected ? 1 : 0,
            fill: props.selected ? 'rgb(255,204,0)' : '',
          }}
        />
      </g>
      <g
        id="body"
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
        id="text"
        transform="translate(46.32 47.82)"
        style={{
          fontSize: 21,
          fontFamily: 'Franca-SemiBold, Franca',
          fontWeight: 600,
        }}
      >
        Menu Title
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
