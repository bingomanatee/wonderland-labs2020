import * as React from 'react';

function PageCarrot(props) {
  return (
    <svg id="PageCarrot" data-name="Layer 1" viewBox="0 0 17 25" width="25" height="17">
      <polyline
        id="arrow"
        points="3 2.88 12.65 12.53 3 22.18"
        style={{
          fill: 'none',
          stroke: props.hover ? 'black' : 'white',
          strokeLinecap: 'round',
          strokeMiterlimit: 10,
          strokeWidth: 4,
        }}
      />
    </svg>
  );
}

export default PageCarrot;
