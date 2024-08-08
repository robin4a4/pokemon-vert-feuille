import React from "react";
import ReactDOM from "react-dom/client";

import { styleReset } from "react95";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import "./main.css";

/* Pick a theme of your choice */
import original from "react95/dist/themes/original";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
/* Original Windows95 font (optional) */
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import { Login } from "./routes/Login";
import { MapBuilder } from "./routes/MapBuilder";
import { Signup } from "./routes/Signup";
import { AppRoute } from "./consts";

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
		path: AppRoute.MAP_BUILDER,
		element: <MapBuilder />,
	},
	{
		path: AppRoute.LOGIN,
		element: <Login />,
	},
    {
		path: AppRoute.SIGNUP,
		element: <Signup />,
	},
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<GlobalStyles />
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={original}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
