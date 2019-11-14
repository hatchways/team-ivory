import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

const loginPageStyle = theme => ({
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

class Login extends Component {
  state = { username: "", password: "" };

  async login(evt) {
    // Prevent page reload
    evt.preventDefault();
    const { username, password } = this.state;
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }).catch(err => console.log(err));
    const data = await res.json();
    console.log(data);
    if (res.status === 200) {
      this.props.updateUser();
      this.props.history.push(`/user/${data.username}`);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.loginPageStyle}>
        <form className={classes.form} onSubmit={e => this.login(e)}>
          <input
            className={classes.formItem}
            type="email"
            placeholder="email"
            onChange={e => this.setState({ username: e.target.value })}
          />
          <input
            className={classes.formItem}
            type="password"
            placeholder="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <input type="submit" />
          <Link to="/signup">New? Signup here</Link>
        </form>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(Login);
