import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import RecipeCard from '../base_components/RecipeCard';
import { Typography, Container, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const UserStyle = theme => ({
	landingContainer: {},
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
	modalCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		margin: 'auto',
	},
	modalPic: {
		width: '250px',
		height: '250px',
		borderRadius: '50%',
		border: '1px solid #000000',
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
	upload: {
		position: 'absolute',
		bottom: '50px',
		left: '60px',
	},
	paper: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: 400,
		height: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		top: '50%',
		left: '50%',
		// marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
});

class User extends Component {
	state = {
		id: '',
		username: '',
		first: '',
		last: '',
		createdAt: '',
		image: '',
		recipes: [],
		followers: [],
		following: [],
		favorites: false,
		followed: false,
		loading: true,
	};

	// Initialize user on login
	componentDidMount() {
		this.requestUser();
		this.getRecipes();
		this.getFollow();
	}
	
	// Ensure user update if :user in url is updated
	componentDidUpdate(lastProps) {
		if (
			lastProps.location.pathname !== this.props.location.pathname ||
			lastProps.user !== this.props.user
		) {
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
		this.setState({ followers, following, loading: false });
	}

	async signout() {
		console.info('Signing out...');
		const res = await fetch('/user/signout', { method: 'POST' });
		if (!res.ok) throw new Error('Unable to signout.');
		this.props.logout();
		this.props.history.push('/login');
	}

	followUser = () => {
		const { user, socket } = this.props;
		const { id } = this.state;
		const notification = {
			userId: id,
			senderId: user.id,
			senderUser: user.user,
			message: 0,
			recipeId: 0,
		};
		socket.emit('follow', notification);
		this.setState({ followed: true });
	};

	updateImage = image => {
		this.setState({ image });
	};

	render() {
		const { classes, user } = this.props;
		const {
			firstName,
			lastName,
			email,
			username,
			image,
			followers,
			following,
			loading,
		} = this.state;
		const urlUser = this.props.location.pathname.split('/').pop();
		const { recipes, followed } = this.state;
		const ownProfile = user && user.user === urlUser ? true : false;

		return (
			<div className={classes.landingContainer}>
				{!loading ? (
					<div>
						<div className={classes.userCard}>
							<img className={classes.profilePic} src={image} alt="" />
							<ProfilePicModal
								classes={classes}
								image={image}
								username={username}
								updateImage={this.updateImage}
							/>
							<div className={classes.userDetails}>
								<h1>{`${firstName} ${lastName}`}</h1>
								<label>{`@${username}`}</label>
								<p>{`Email: ${email}`}</p>
								<p>
									Followers:{' '}
									{followers.length > 0
										? followers.map(f => (
												<NavLink to={`/user/${f}`}>{f} </NavLink>
										  ))
										: 'No followers'}
								</p>
								<p>
									Following:{' '}
									{following.length > 0
										? following.map(f => (
												<NavLink to={`/user/${f}`}>{f} </NavLink>
										  ))
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
				) : (
					<div>Loading...</div>
				)}
			</div>
		);
	}
}

class ProfilePicModal extends Component {
	state = {
		username: '',
		open: false,
		success: false,
		file: null,
		image: '',
	};

	componentDidUpdate(lastProps) {
		if (lastProps !== this.props) {
			this.setState({ ...this.props });
		}
	}
	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false, success: false });
	};

	handleImageChange = e => {
		this.setState({ success: false, file: e.target.files[0] });
	};

	handleImageSubmit = async e => {
		e.preventDefault();
		const { username, file } = this.state;
		const type = file.name.split('.')[1];
		const body = { username, type };
		try {
			// Fetch signed URL
			const res = await fetch(`/user/${username}/profile/upload`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error('Unable to upload image');
			const { returnData } = await res.json();
			this.props.updateImage(returnData.url);

			// Upload to S3 with signed URL
			const amazonRes = await fetch(returnData.signedRequest, {
				method: 'PUT',
				headers: { 'Content-Type': `image/${type}` },
				body: file,
			});
			if (!amazonRes.ok) throw new Error('Unable to upload image.');
			this.setState({ success: true, image: returnData.url });
		} catch (e) {
			console.error(e);
		}
	};

	render() {
		const { classes } = this.props;
		const { open, success, file, image } = this.state;
		return (
			<div className={classes.upload}>
				<button type="button" onClick={this.handleOpen}>
					Edit
				</button>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={open}
					onClose={this.handleClose}>
					<div className={classes.paper}>
						<div className={classes.modalCard}>
							<h4 id="simple-modal-title">Edit Your Profile Picture</h4>
							<img className={classes.modalPic} src={image} alt="" />
							{success ? (
								<p>Success!</p>
							) : (
								<form onSubmit={this.handleImageSubmit}>
									<input type="file" onChange={this.handleImageChange} />
									{file ? (
										<p>
											<button type="submit">Upload</button>
										</p>
									) : (
										''
									)}
								</form>
							)}
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withStyles(UserStyle)(User);
