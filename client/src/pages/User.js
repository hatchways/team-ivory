import React, { Component } from 'react';
import RecipeCard from '../base_components/RecipeCard';
import { Typography, Container, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const UserStyle = theme => ({
	landingContainer: {
		// margin: theme.spacing.unit * 2,
	},
	userCard: {
		position: 'relative',
		display: 'flex',
		border: '2px solid #000000',
		'border-radius': '5px',
		'box-shadow': '5px 6px 0px #E0E0E0',
		margin: '20px',
		padding: '10px',
		background: '#ffffff',
	},
	userDetails: {
		margin: '10px 30px',
	},
	userRecipes: {
		width: '100%',
		display: 'grid',
		'grid-auto-flow': 'row',
		// repeats as many times as it can; min width 500px
		'grid-template-columns': 'repeat(auto-fit, minmax(500px, 1fr))',
	},
	profilePic: {
		width: '150px',
		height: '150px',
		'border-radius': '50%',
		border: '2px solid #000000',
	},
	recipes: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	recipe: {
		margin: '10px',
	},
	follow: {
		position: 'absolute',
		top: '15px',
		right: '20px',
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
		followed: false,
	};

	// Set up initial user
	componentDidMount() {
		this.requestUser();
		this.getRecipes();
	}

	// Ensure user update if :user in url is updated
	componentDidUpdate(lastProps) {
		if (
			lastProps.location.pathname !== this.props.location.pathname ||
			lastProps.user != this.props.user
		) {
			this.requestUser();
			this.getRecipes();
		}
	}

	// Get the user from the url and request data from server
	async requestUser() {
		const urlUser = this.props.location.pathname.split('/').pop();
		console.log(this.props.user);
		let url = this.props.user
			? '/user/' + urlUser + '?userId=' + this.props.user.id
			: '/user/' + urlUser;
		console.log(url);
		const res = await fetch(url, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		});
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

	followUser = () => {
		fetch('/api/followers', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				followId: this.state.id,
			}),
		}).then(res => {
			this.setState({ followed: true });
		});
	};

	render() {
		const { classes, user } = this.props;
		const { id, firstName, lastName, email, username } = this.state;
		const urlUser = this.props.location.pathname.split('/').pop();
		const { recipes, followed } = this.state;
		const ownProfile = user && user.user === urlUser ? true : false;

		return (
			<div className={classes.landingContainer}>
				<div className={classes.userCard}>
					<div className={classes.profilePic}></div>
					<div className={classes.userDetails}>
						<h1>{`${firstName} ${lastName}`}</h1>
						<label>{`@${username}`}</label>
						<p>{`Email: ${email}`}</p>
					</div>
					{!ownProfile ? (
						<div className={classes.follow}>
							{followed ? (
								<Typography>Followed</Typography>
							) : (
								<Button
									variant="contained"
									color="secondary"
									onClick={this.followUser}>
									Follow
								</Button>
							)}
						</div>
					) : null}
				</div>
				<Container className={classes.recipes}>
					<h2>{`${firstName}'s recipes:`}</h2>
					<div className={classes.userRecipes}>
						{recipes.length > 0 ? (
							recipes.map(recipe => (
								<RecipeCard recipe={recipe} className={classes.recipe} />
							))
						) : (
							<label>This user hasn't posted any recipes yet</label>
						)}
					</div>
				</Container>
			</div>
		);
	}
}

export default withStyles(UserStyle)(User);
