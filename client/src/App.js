import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import BuilderPage from "./pages/Builder";
import Feed from "./base_components/Feed";
import AppNavbar from './base_components/Navbar'

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AppNavbar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/builder" component={BuilderPage} />
        <Route exact path="/feed" component={Feed} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
