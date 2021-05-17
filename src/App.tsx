import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
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
      main: "#20b3e7",
    },
    secondary: {
      main: amber[300],
    },
    text: {
      // #fee937 - maybe a good yellow
      // #f9ed37 - actual iitb yellow
      secondary: amber[300],
      primary: "#20b3e7", // actual iitb blue
    },
  },
});

ReactGA.initialize("UA-44282114-3");

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const Routes = () => {
  const l = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [l.pathname]);

  return (
    <Switch>
      <Route path="/join" exact children={<JoinGame />} />
      <Route path="/" exact children={<JoinGame />} />
      <Route path="/game" children={<Game />} />
    </Switch>
  );
};

export default App;
