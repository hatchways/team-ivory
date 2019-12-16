import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import RecipeCard from '../base_components/RecipeCard';
import { Typography, Container, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const UserStyle = theme => ({
	landingContainer: {
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
	upload: {
		position: 'absolute',
		bottom: '0px',
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
		followers: [],
		following: [],
		favorites: false,
		followed: false,
		upload: null,
		image: null,
	};

	// Set up initial user
	componentDidMount() {
		this.requestUser();
		this.getRecipes();
		this.getFollow();
	}

	// Ensure user update if :user in url is updated
	componentDidUpdate(lastProps) {
		if (
			lastProps.location.pathname !== this.props.location.pathname ||
			lastProps.user != this.props.user
		) {
			console.log(this.props);
			this.requestUser();
			this.getRecipes();
			this.getFollow();
		}
	}

	// Get the user from the url and request data from server
	async requestUser() {
		const urlUser = this.props.location.pathname.split('/').pop();
		let url = this.props.user
			? '/user/' + urlUser + '?userId=' + this.props.user.id
			: '/user/' + urlUser;
		const res = await fetch(url, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (res.status >= 400 && res.status < 500) {
			return this.props.history.push('/login');
		}
		if (res.status === 200) {
			const data = await res.json();
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

	// Get user's followers and list of following
	async getFollow() {
		const urlUser = this.props.location.pathname.split('/').pop();
		const res = await Promise.all([
			fetch(`/user/${urlUser}/followers`, { method: 'GET' }),
			fetch(`/user/${urlUser}/following`, { method: 'GET' }),
		]);
		const followers = await res[0].json();
		const following = await res[1].json();
		this.setState({ followers, following });
	}

	async signout() {
		console.info('Signing out...');
		const res = await fetch('/user/signout', { method: 'POST' });
		this.props.logout();
		this.props.history.push('/login');
	}

	followUser = () => {
		const { user, socket } = this.props;
		const { id } = this.state;
		const notification = { userId: id, senderId: user.id, senderUser: user.user, message: 0, recipeId: 0 };
		socket.emit('follow', notification, res => {
			console.log('sending notification to socket...');
		});
		this.setState({ followed: true });
	};

	handleImageChange(e) {
		this.setState({ upload: e.target.files[0] });
	}

	handleImageSubmit = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('profile', this.state.upload);
		const res = await fetch(`/user/${this.state.username}/profile/upload`, {
			method: 'POST',
			body: formData,
		});
		this.setState({ upload: null });
	};

	render() {
		const { classes, user } = this.props;
		const { id, firstName, lastName, email, username, followers, following } = this.state;
		const urlUser = this.props.location.pathname.split('/').pop();
		const { recipes, followed } = this.state;
		const ownProfile = user && user.user === urlUser ? true : false;

		return (
			<div className={classes.landingContainer}>
				<div className={classes.userCard}>
					<div className={classes.profilePic}></div>
					<div className={classes.upload}>
						<form onSubmit={this.handleImageSubmit}>
							<input type="file" onChange={this.handleImageChange.bind(this)} />
							<p>
								<button type="submit">Upload</button>
							</p>
						</form>
					</div>
					<div className={classes.userDetails}>
						<h1>{`${firstName} ${lastName}`}</h1>
						<label>{`@${username}`}</label>
						<p>{`Email: ${email}`}</p>
						<p>
							Followers:{' '}
							{followers.length > 0
								? followers.map(f => <NavLink to={`/user/${f}`}>{f} </NavLink>)
								: 'No followers'}
						</p>
						<p>
							Following:{' '}
							{following.length > 0
								? following.map(f => <NavLink to={`/user/${f}`}>{f} </NavLink>)
								: 'Not following any users'}
						</p>
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
