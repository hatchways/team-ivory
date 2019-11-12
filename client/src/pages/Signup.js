import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

const signupPageStyle = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    "justify-content": "center",
    "align-items": "center"
  },
  formItem: {
    display: "block",
    margin: "5px",
    padding: "5px",
    "border-radius": "5px"
  }
});

class Signup extends Component {
  state = {
    username: "",
    password: "",
    passwordConfirm: "",
    first: "",
    last: "",
    email: ""
  };

  // Send signup request to server
  async signup(evt) {
    // Prevent page reload
    evt.preventDefault();
    const {
      username,
      password,
      first,
      last,
      email,
      passwordConfirm
    } = this.state;
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        first,
        last,
        email,
        passwordConfirm
      })
    }).catch(err => {
      console.log("Error signing up: ", err);
      return;
    });
    const data = await res.json();
    console.log(data);
    if (res.status == 200) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.signupPageStyle}>
        <form className={classes.form} onSubmit={e => this.signup(e)}>
          <input
            className={classes.formItem}
            placeholder="first name"
            onChange={e => this.setState({ first: e.target.value })}
          />
          <input
            className={classes.formItem}
            placeholder="last name"
            onChange={e => this.setState({ last: e.target.value })}
          />
          <input
            className={classes.formItem}
            placeholder="username"
            onChange={e => this.setState({ username: e.target.value })}
          />
          <input
            className={classes.formItem}
            /*type='email'*/ placeholder="email"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            className={classes.formItem}
            type="password"
            placeholder="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <input
            className={classes.formItem}
            type="password"
            placeholder="confirm password"
            onChange={e => this.setState({ passwordConfirm: e.target.value })}
          />
          <input type="submit" />
          <Link to="/login">Already have an account? Sign in here</Link>
        </form>
      </div>
    );
  }
}

export default withStyles(signupPageStyle)(Signup);
