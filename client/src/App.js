import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import BuilderPage from "./pages/Builder";
import Feed from "./base_components/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import User from "./pages/User";
import AppNavbar from "./base_components/Navbar";

import "./App.css";

class App extends Component {
  state = { user: null };

  componentDidMount() {
    this.updateUser();
  }

  // userId() {
  //   c
  // }

  updateUser() {
    // If jwt cookie set, get user from the cookie
    console.info("Updating user...");
    const jwt = Cookies.get("jwt");
    if (jwt) {
      const user = atob(jwt.split(".")[1]);
      console.log("JWT", user)
      this.setState({ user: JSON.parse(user) });
    }
  }

  logout() {
    this.setState({ user: null });
  }

  render() {
    console.log("Rerending app.");
    console.log("THIS.STATE", this.state.user)
    const { user } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <AppNavbar user={user} logout={() => this.logout()} />
          <div style={{ marginTop: "4rem" }}>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/builder" component={BuilderPage} />
            <Route exact 
              path="/feed" 
              render={props => (
                <Feed {...props} user={this.state.user} />
              )} 
            />
            <Route
              exact
              path="/login"
              render={props => (
                <Login
                  {...props}
                  updateUser={() => this.updateUser()}
                  username={this.state}
                />
              )}
            />
            <Route exact path="/signup" component={Signup} />
            <Route
              exact
              path={`/user/:username`}
              render={props => (
                <User {...props} user={user} logout={() => this.logout()} />
              )}
            />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
