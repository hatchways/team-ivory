import React, { Component } from 'react';
import RecipeCard from '../base_components/RecipeCard';

import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
//   recipeCard: {
//     marginTop: '2rem',
//     margin: 'auto',
//   },
// }));

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2,
  },
  userCard: {
    display: 'flex',
    border: '2px solid #000000',
    'border-radius': '5px',
    'box-shadow': '5px 6px 0px #E0E0E0',
    margin: '20px',
    padding: '10px',
  },
  userDetails: {
    margin: '10px 30px',
  },
  profilePic: {
    width: '150px',
    height: '150px',
    'border-radius': '50%',
    border: '2px solid #000000',
  },
  userLinks: {
    width: '100px',
    display: 'flex',
    'flex-direction': 'column',
  },
});

class User extends Component {
  state = {
    username: '',
    first: '',
    last: '',
    email: '',
    recipes: [],
  };

  // Set up initial user
  componentDidMount() {
    this.requestUser();
    this.getRecipes();
  }

  // Ensure user update if :user in url is updated
  componentDidUpdate(lastProps) {
    if (lastProps.location.pathname !== this.props.location.pathname) {
      this.requestUser();
      this.getRecipes();
    }
  }

  // Get the user from the url and request data from server
  async requestUser() {
    const urlUser = this.props.location.pathname.split('/').pop();
    const res = await fetch('/user/' + urlUser);
    console.log(res);
    if (res.status >= 400 && res.status < 500) {
      return this.props.history.push('/login');
    }
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      this.setState({ ...data });
    }
  }

  async getRecipes() {
    const urlUser = this.props.location.pathname.split('/').pop();
    const res = await fetch('/api/recipes/' + urlUser);
    console.log(res);
    if (res.status >= 400 && res.status < 500) {
      return this.props.history.push('/login');
    }
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      this.setState({ recipes: data });
    }
  }

  async signout() {
    console.info('Signing out...');
    const res = await fetch('/user/signout', { method: 'POST' });
    console.log(await res.json());
    this.props.logout();
    this.props.history.push('/login');
  }

  render() {
    const { classes } = this.props;
    const { firstName, lastName, email, username } = this.state;
    const urlUser = this.props.location.pathname.split('/').pop();
    const { user } = this.props;
    const { recipes } = this.state;
    let ownProfile = false;
    if (user && user.user == urlUser) {
      ownProfile = true;
    }

    return (
      <div className={classes.landingContainer}>
        <div className={classes.userCard}>
          <div className={classes.profilePic}></div>
          <div className={classes.userDetails}>
            <h1>{`${firstName} ${lastName}`}</h1>
            <label>{`@${username}`}</label>
            <p>{`Email: ${email}`}</p>
          </div>
        </div>
        {ownProfile ? <UserLinks classes={classes} signout={() => this.signout()} /> : null}
        <div>
          <h2>{`${firstName}'s recipes:`}</h2>
          {recipes.length > 0 ? (
            recipes.map(recipe => <RecipeCard recipe={recipe} /*className={classes.recipeCard}*/ />)
          ) : (
            <label>This user hasn't posted any recipes yet</label>
          )}
        </div>
      </div>
    );
  }
}

class UserLinks extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.userLinks}>
        <button>Favorites</button>
        <button>Basket</button>
        <button onClick={this.props.signout}>Sign out</button>
      </div>
    );
  }
}

export default withStyles(landinPageStyle)(User);
