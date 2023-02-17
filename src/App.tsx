import React, { useEffect } from "react";
import {
  RouterProvider,
  Route,
  useLocation,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import JoinGame from "./pages/join-game";
import Game from "./pages/game";
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";
import ReactGA from "react-ga";
import { amber } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#020e19",
      paper: "#062f4a",
    },
    primary: {
      main: "#46D9FF",
    },
    secondary: {
      main: amber[300],
    },
    text: {
      // #fee937 - maybe a good yellow
      // #f9ed37 - actual iitb yellow
      secondary: amber[300],
      primary: "#46D9FF", // actual iitb blue
    },
  },
});

ReactGA.initialize("UA-44282114-4");

const PageView = ({ Component }: { Component: React.ReactNode }) => {
  const l = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [l.pathname]);

  return <>{Component}</>;
};

const router = createBrowserRouter([
  {
    path: "/join",
    element: <PageView Component={<JoinGame />} />,
  },
  {
    path: "/game",
    element: <PageView Component={<Game />} />,
  },
  {
    path: "/",
    element: <PageView Component={<JoinGame />} />,
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
