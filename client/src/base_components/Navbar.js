import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import {
	AppBar,
	Button,
	Toolbar,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PeopleIcon from '@material-ui/icons/People';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import '../css/navbar.css';
import { withStyles } from '@material-ui/styles';
import Snackbar from '@material-ui/core/Snackbar';

const Styles = theme => ({
	container: {
		background: '#A9E190',
		zIndex: -4,
	},
	title: {
		fontSize: '1.2em',
	},
	grow: {
		flexGrow: 1,
	},
});

class AppNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			windowWidth: window.innerWidth,
			notifications: [{ message: 'no notifications' }],
		};
	}

	handleNotifications = async () => {
		console.log('clicked notifications');
		const res = await fetch('/api/notifications', { method: 'GET' });
		let notifications = [];
		if (res.status === 200) notifications = await res.json();
		this.setState({ notifications });
	};

	componentDidMount() {
		window.addEventListener('resize', () => this.getWindowWidth());
		this.handleNotifications();
	}

	getWindowWidth() {
		this.setState({ windowWidth: window.innerWidth });
	}

	render() {
		const { user, classes, history, socket } = this.props;
		const { windowWidth, notifications } = this.state;
		console.log(windowWidth);
		return (
			<React.Fragment>
				<AppBar position="static" className={classes.container}>
					<Toolbar>
						<Button className={classes.title} href="/">
							Ingridify
						</Button>
						<Button href="/feed">Recipes</Button>
						{Boolean(user) ? (
							<React.Fragment>
								{windowWidth > 600 ? (
									<React.Fragment>
										<Button href="/following">Following</Button>
										<Button href="/builder">Post Recipe</Button>
									</React.Fragment>
								) : null}
								<div className={classes.grow}></div>
								<UserNotifications
									user={user}
									history={history}
									notifications={notifications}
									windowWidth={windowWidth}
									logout={this.props.logout}
									socket={socket}
									classes={classes}
								/>
								<UserMenu
									user={user}
									history={history}
									windowWidth={windowWidth}
									logout={this.props.logout}
								/>
							</React.Fragment>
						) : (
							<React.Fragment>
								<div className={classes.grow}></div>
								<Button href="/login">Login</Button>
							</React.Fragment>
						)}
					</Toolbar>
				</AppBar>
			</React.Fragment>
		);
	}
}

class UserNotifications extends Component {
	state = { anchorEl: null, notifications: [], newNotification: false };

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			const { socket } = this.props;
			// Listens for comments by other users
			socket.on('comment', res => {
				this.handleNotifications(res);
			});
			// Listens for follows by others
			socket.on('follow', res => {
				this.handleNotifications(res);
			});
			// Listens for favorites by others
			socket.on('favorite', res => {
				if (res.favorited) {
					this.handleNotifications(res);
				}
			});
			this.setState({ notifications: this.props.notifications });
		}
	}

	handleNotifications(n) {
		const notify = fetch(`/api/notifications`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(n),
		});
		this.setState({
			notifications: [n, ...this.state.notifications],
			newNotification: true,
		});
	}

	setAnchor(e) {
		this.setState({ anchorEl: e.currentTarget, newNotification: false });
	}

	handleClose() {
		this.setState({ anchorEl: null, newNotification: false });
	}

	navTo(target) {
		this.handleClose();
		this.props.history.push(target);
	}
	render() {
		const { anchorEl, newNotification, notifications, transition } = this.state;
		const { user, windowWidth, classes } = this.props;
		let message;
		if (newNotification) {
			if (notifications[0].message === 0) {
				message = `${notifications[0].senderUser} has followed you.`;
			}
			if (notifications[0].message === 1) {
				message = `${notifications[0].senderUser} has commented on your recipe.`;
			}
			if (notifications[0].message === 2) {
				message = `${notifications[0].senderUser} liked your recipe.`;
			}
		}

		// Build notification list
		let nList;
		nList = notifications.map((el, idx) => {
			let div;
			switch (el.message) {
				case 0:
					div = (
						<div>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<NavLink to={`/user/${el.senderUser}`}>{el.senderUser} </NavLink>
							followed you.
						</div>
					);
					break;
				case 1:
					div = (
						<div>
							<ListItemIcon>
								<CommentIcon />
							</ListItemIcon>
							<NavLink to={`/user/${el.senderUser}`}>{el.senderUser}</NavLink>{' '}
							commented on your{' '}
							<NavLink to={`/recipe/${el.recipeId}`}>recipe</NavLink>.
						</div>
					);
					break;
				case 2:
					div = (
						<div>
							<ListItemIcon>
								<FavoriteIcon />
							</ListItemIcon>
							<NavLink to={`/user/${el.senderUser}`}>{el.senderUser}</NavLink> liked
							your <NavLink to={`/recipe/${el.recipeId}`}>recipe</NavLink>.
						</div>
					);
					break;
				default:
					break;
			}
			return <MenuItem key={idx}>{div}</MenuItem>;
		});

		return (
			<div>
				{newNotification ? (
					<React.Fragment>
						<IconButton onClick={e => this.setAnchor(e)}>
							<NotificationsActiveIcon style={{ color: 'red' }} />
						</IconButton>
						<Snackbar
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							open={newNotification}
							onClose={() => this.handleClose()}
							message={message}></Snackbar>
					</React.Fragment>
				) : (
					<IconButton onClick={e => this.setAnchor(e)}>
						<NotificationsIcon />
					</IconButton>
				)}
				<Menu
					style={{ maxHeight: '600px' }}
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={() => this.handleClose()}>
					{notifications.length === 0 ? (
						<MenuItem onClick={() => this.handleClose()}>No notifications</MenuItem>
					) : null}
					{nList}
				</Menu>
			</div>
		);
	}
}

class UserMenu extends Component {
	state = { anchorEl: null };

	setAnchor(e) {
		this.setState({ anchorEl: e.currentTarget });
	}

	handleClose() {
		this.setState({ anchorEl: null });
	}

	navTo(target) {
		this.handleClose();
		this.props.history.push(target);
	}
	render() {
		const { anchorEl } = this.state;
		const { user, windowWidth } = this.props;
		return (
			<div>
				<IconButton onClick={e => this.setAnchor(e)}>
					<AccountCircle />
				</IconButton>
				<Menu
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={() => this.handleClose()}>
					<MenuItem onClick={() => this.navTo(`/user/${user.user}`)}>
						{user.name}
					</MenuItem>
					{windowWidth < 601 ? (
						<MenuItem onClick={() => this.navTo('/following')}>Following</MenuItem>
					) : null}
					<MenuItem onClick={() => this.navTo(`/user/${user.user}/favorites`)}>
						Favorites
					</MenuItem>
					{windowWidth < 601 ? (
						<MenuItem onClick={() => this.navTo('/builder')}>Post Recipe</MenuItem>
					) : null}
					<MenuItem onClick={() => this.navTo('/cart')}>Cart</MenuItem>
					<MenuItem onClick={() => this.navTo('/profile')}>Account</MenuItem>
					<MenuItem onClick={this.props.logout}>Logout</MenuItem>
				</Menu>
			</div>
		);
	}
}

export default withStyles(Styles)(AppNavbar);
