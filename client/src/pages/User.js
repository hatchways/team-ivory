import React, { Component } from 'react';
import RecipeCard from '../base_components/RecipeCard';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Favorites from './Favorites';

const UserStyle = theme => ({
	landingContainer: {
		// margin: theme.spacing.unit * 2,
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
		id: '',
		username: '',
		first: '',
		last: '',
		createdAt: '',
		recipes: [],
		favorites: false,
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

	// Get user's recipes
	async getRecipes() {
		const urlUser = this.props.location.pathname.split('/').pop();
		const res = await fetch('/api/recipes/' + urlUser);

		if (res.status === 200) {
			const data = await res.json();
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

	favorites() {
		console.log('Clicked Favorites');
		this.setState({ favorites: !this.state.favorites });
	}

	render() {
		const { classes } = this.props;
		const { id, firstName, lastName, email, username } = this.state;
		const urlUser = this.props.location.pathname.split('/').pop();
		const { user } = this.props;
		const { recipes } = this.state;
		let ownProfile = false;
		if (user && user.user === urlUser) {
			ownProfile = true;
		}
		console.log(ownProfile);
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
				{ownProfile ? (
					<UserLinks
						classes={classes}
						signout={() => this.signout()}
						favorites={() => this.favorites()}
					/>
				) : null}
				<div>
					{this.state.favorites ? (
						<Favorites id={id} username={username} firstName={firstName} />
					) : (
						''
					)}
				</div>
				<div>
					<h2>{`${firstName}'s recipes:`}</h2>
					{recipes.length > 0 ? (
						recipes.map(recipe => (
							<RecipeCard recipe={recipe} /*className={classes.recipeCard}*/ />
						))
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
				<button onClick={this.props.favorites}>Favorites</button>
				<button>Basket</button>
				<button onClick={this.props.signout}>Sign out</button>
				<Link to="/profile">Profile</Link>
			</div>
		);
	}
}

export default withStyles(UserStyle)(User);
