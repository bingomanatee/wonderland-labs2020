import React from 'react';
import { Box, ResponsiveContext, ThemeContext } from 'grommet';
import styled from 'styled-components';
const buttonTheme = {
  button: {
    border: {
      width: '1px',
      radius: '0 8px 8px 0',
      color: 'accent-2',
    },
    padding: {
      vertical: '2px',
      horizontal: '2px',
    },
  },
};

const smallButtonTheme = {
  button: {
    padding: {
      vertical: '2px',
      horizontal: '0.5rem',
    },
  },
};

export default ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      switch (size) {
        case 'small':
        case 'medium':
          return (
            <Box
              as="section"
              direction="row"
              gap="large"
              justify="center"
              fill="horizontal"
              wrap
            >
              <ThemeContext.Extend
                value={smallButtonTheme}
              >
                {children}
              </ThemeContext.Extend>
            </Box>
          );
          break;

        default:
          return (
            <Box
              as="section"
              direction="column"
              gap="large"
              align="start"
              fill="horizontal"
              pad={{top: '2rem'}}
            >
              <ThemeContext.Extend
                value={smallButtonTheme}
              >
                {children}
              </ThemeContext.Extend>
            </Box>
          );
      }
    }}
  </ResponsiveContext.Consumer>
);

/**
 <Box
 as="section"
 direction="column"
 gap="large"
 pad="none"
 >
 <ThemeContext.Extend
 value={buttonTheme}
 >
 {children}
 </ThemeContext.Extend>
 </Box>

 */
