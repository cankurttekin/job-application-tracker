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

  input, input[type="date"], select {
    border-radius: 6px;
    border: 1px solid #ccc;
      padding: 6px;
    margin-bottom: 10px;
    width: 100%;
      
  }

  button {
      background-color: black;
      color: white;
      padding: 6px;
      padding-left: 24px;
      padding-right: 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
  }
  
  select {
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: transparent;
      color: black;
      width: 100%;
      height: auto;
  }

  button:hover {
      background-color: #333;
  }
  
  textarea {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      width: 100%;
  }

  close-button {
      position: absolute;
      top: 2px;
      right: 2px;
      background: #ebebeb;
      color: #333;
      font-size: 26px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
  }

  close-button:hover {
      background-color: #dedede;
  }

  modal-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
  }

  a {
      color: inherit;
      text-decoration: none;
      &:hover {
          text-decoration: underline;
      }
  }
`;

export default GlobalStyle;
