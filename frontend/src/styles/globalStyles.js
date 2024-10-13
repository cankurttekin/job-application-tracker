import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Fira Sans', sans-serif;
    background-color: #ffffff;
    color: #0d0d0d;
  }

  button, input {
    border-radius: 5px;
  }
`;

export default GlobalStyle;

