// src/theme.js — DESIGN SYSTEM MEGA BIXO
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#F7FAFC',
        fontFamily: "'BaraoFont', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      },
      '#root': { width: '100%', display: 'flex', justifyContent: 'center' },
    },
  },
  fonts: {
    heading: "'BaraoFont', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'BaraoFont', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  colors: {
    // Tons Primários
    azulPrincipal:   '#2B6CB0', // rgb(43, 108, 176)
    azulSecundario:  '#4299E1', // rgb(66, 153, 225)
    verdeSucesso:    '#38A169', // rgb(56, 161, 105)
    douradoEscuro:   '#9E681E', // rgb(158, 104, 30)
    douradoClaro:    '#C9A058', // rgb(201, 160, 88)
    ciano:           '#00B7B5', // rgb(0, 183, 181)
    cianoClaro:      '#49CAC8', // rgb(73, 202, 200)

    // Alerta e Erro
    vermelhoPrincipal: '#E53E3E', // rgb(229, 62, 62)
    vermelhoClaro:     '#F56565', // rgb(245, 101, 101)

    // Fundos Escuros
    fundoEscuro:     '#1A202C', // rgb(26, 32, 44)
    fundoCards:      '#2D3748', // rgb(45, 55, 72)
    cinzaEscuro:     '#4A5568', // rgb(74, 85, 104)

    // Fundos Claros e Textos
    fundoCinzaClaro: '#F7FAFC', // rgb(247, 250, 252)
    fundoNeve:       '#F4F7F5', // rgb(244, 247, 245)
    textoSecundario: '#A0AEC0', // rgb(160, 174, 192)
    textoDesabilitado: '#757575', // rgb(117, 117, 117)

    // Sobreposição
    modalOverlay:    'rgba(0, 0, 0, 0.48)',
    sombraLeve:      'rgba(0, 0, 0, 0.06)',

    // Tons extras do Design System
    azulEscuro:      '#2A4365', // rgb(42, 67, 101)
    azulClaro:       '#BEE3F8', // rgb(190, 227, 248)
    cinzaBorda:      '#EDF2F7', // rgb(237, 242, 247)
    laranjaClaro:    '#FEEBC8', // rgb(254, 235, 200)
    verdeClaro:      '#C6F6D5', // rgb(198, 246, 213)
    verdeEscuro:     '#22543D', // rgb(34, 84, 61)
    pretoSuave:      '#212121', // rgb(33, 33, 33)

    // Aliases legados (Chakra color schemes)
    containerBg:   '#1A202C',
    inputBg:       '#2D3748',
    goldBorder:    '#C9A058',
    registerBtn:   { 500: '#F7FAFC', 600: '#EDF2F7' },
    submitBtn:     { 500: '#ffffff', 600: '#F7FAFC' },
    recoverBtn:    { 500: '#ffffff', 600: '#EDF2F7' },
    tealGreen:     { 500: '#00B7B5', 600: '#49CAC8' },
    blackBtn:      { 500: '#1A202C', 600: '#2D3748' },
    darkBlue:      { 500: '#2B6CB0', 600: '#2A4365' },
    goldBtn:       { 500: '#C9A058', 600: '#9E681E' },
  },
  components: {
    Input: {
      variants: {
        custom: {
          field: {
            bg: 'inputBg', color: 'white', borderRadius: '10px', border: 'none',
            _placeholder: { color: '#A0AEC0' },
            fontSize: '14px',
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
