import React from "react";
import ReactDOM from "react-dom/client";

import { styleReset } from "react95";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import "./main.css";

/* Pick a theme of your choice */
import original from "react95/dist/themes/original";

/* Original Windows95 font (optional) */
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./routes/Login";
import { MapBuilder } from "./routes/MapBuilder";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
  body {
    background-color: teal;
    padding: 16px;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapBuilder />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
