import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});

class User extends Component {
  state = {
    username: "",
    password: "",
    passwordConfirm: "",
    first: "",
    last: "",
    email: ""
  };

  async componentDidMount() {
    const res = await fetch("/user");
    console.log(res);
    if (res.status >= 400 && res.status < 500) {
      return this.props.history.push("/login");
    }
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      this.setState({ ...data });
    }
  }

  async signout() {
    console.info("Signing out...");
    const res = await fetch("/user/signout", { method: "POST" });
    console.log(await res.json());
    this.props.logout();
    this.props.history.push("/login");
  }

  render() {
    const { classes } = this.props;
    const { firstName, lastName, email, username } = this.state;
    return (
      <div className={classes.landingContainer}>
        <p>{`Hello, ${firstName} ${lastName}`}</p>
        <p>{`Username: ${username}`}</p>
        <p>{`Email: ${email}`}</p>
        <button onClick={() => this.signout()}>Sign out</button>
      </div>
    );
  }
}

export default withStyles(landinPageStyle)(User);
