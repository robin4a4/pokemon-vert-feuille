import React from "react";
import ReactDOM from "react-dom/client";

import { styleReset } from "react95";
import { ThemeProvider, createGlobalStyle } from "styled-components";

/* Pick a theme of your choice */
import original from "react95/dist/themes/original";

import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
/* Original Windows95 font (optional) */
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import { LoginRoute } from "./routes/LoginRoute";
import { MapBuilderRoute } from "./routes/MapBuilderRoute";
import { SignupRoute } from "./routes/SignupRoute";
import { AppRoute } from "./consts";
import { DashboardRoute } from "./routes/DashboardRoute";
import { PrivateRoute } from "./routes/utils/PrivateRoute";
import "./main.css";

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
        path: AppRoute.DASHBOARD,
        element: <PrivateRoute element={<DashboardRoute />}/>,
      },
	{
		path: AppRoute.MAP_BUILDER,
		element: <MapBuilderRoute />,
        children: [
            {
            path: ":gridId",
            element: <MapBuilderRoute />
            }
        ]
	},
	{
		path: AppRoute.LOGIN,
		element: <LoginRoute />,
	},
    {
		path: AppRoute.SIGNUP,
		element: <SignupRoute />,
	},
]);

const queryClient = new QueryClient(
    {
        mutationCache: new MutationCache({
            onSuccess: () => {
              queryClient.invalidateQueries()
            },
          }),
    }
);

const root = document.getElementById("root");
if (root)
ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<GlobalStyles />
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={original}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
