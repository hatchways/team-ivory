import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import BuilderPage from "./pages/Builder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppNavbar from './base_components/Navbar'

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AppNavbar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/builder" component={BuilderPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
