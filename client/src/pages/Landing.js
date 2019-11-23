import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";
import Feed from '../base_components/Feed'

import Ping from "./Ping";

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});

class LandingPage extends Component {
  state = {
    testUser: "Client did not fetch test user from database (check your code)",
    welcomeMessage: "Step 1: Run the server and refresh (not running)",
    step: 0,
    recipes: []
  };

  componentDidMount() {
    fetch('api/recipes', {
        method: 'get',
        headers: {
          "Content-Type": "application/json"
        }
    }).then((res)=>{
        return res.json() 
    }).then((recipes)=>{
        this.setState({recipes: recipes})
    })
  }

  incrementStep = () => {
    this.setState(prevState => ({ step: (prevState.step += 1) }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.landingContainer}>
        <Feed recipes={this.state.recipes} user={this.props.user} />
      </div>
    );
  }
}

export default withStyles(landinPageStyle)(LandingPage);
