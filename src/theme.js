// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: { bg: '#f0f2f5', fontFamily: "'Roboto', sans-serif" },
      '#root': { width: '100%', display: 'flex', justifyContent: 'center' },
    },
  },
  colors: {
    containerBg: '#000',
    inputBg: '#333',
    goldBorder: '#C09A53',
    registerBtn: { 500: '#f0f2f5', 600: '#e0e0e0' },
    submitBtn:   { 500: '#ffffff', 600: '#f9f9f9' },
    recoverBtn:  { 500: '#ffffff', 600: '#e9e9e9' },
    tealGreen:   { 500: '#14b8a6', 600: '#0d9488' },
    blackBtn:    { 500: '#171717', 600: '#262626' },
    darkBlue:    { 500: '#000080', 600: '#00005a' },
    goldBtn:     { 500: '#C09A53', 600: '#a0803d' },
  },
  components: {
    Input: {
      variants: {
        custom: {
          field: {
            bg: 'inputBg', color: 'white', borderRadius: '10px', border: 'none',
            _placeholder: { color: 'gray.400' },
          },
        },
      },
    },
    Button: {
      baseStyle: { borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1em', width: '100%' },
    },
  },
});

export default theme;
