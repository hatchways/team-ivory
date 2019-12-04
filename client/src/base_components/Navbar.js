import React, { Component } from 'react';
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
import PeopleIcon from '@material-ui/icons/People';
import CommentIcon from '@material-ui/icons/Comment';
import '../css/navbar.css';
import { withStyles } from '@material-ui/styles';

const Styles = theme => ({
	container: {
		background: '#A9E190',
		zIndex: 3,
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
		const res = await fetch('/api/notifications', { method: 'POST' });
		let notifications = [];
		if (res.status === 200) notifications = await res.json();
		console.log(notifications);
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
		const { user, classes, history } = this.props;
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
		const { user, windowWidth, notifications } = this.props;
		console.log(notifications);
		// const notifications = [];
		return (
			<div>
				<IconButton onClick={e => this.setAnchor(e)}>
					<NotificationsIcon />
				</IconButton>
				<Menu
					style={{ maxHeight: '600px' }}
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={() => this.handleClose()}>
					{notifications.length === 0 ? (
						<MenuItem onClick={() => this.handleClose()}>No notifications</MenuItem>
					) : null}
					{notifications.map(el => (
						<MenuItem>
							<ListItemIcon>
								{el.message === 0 ? <PeopleIcon /> : <CommentIcon />}
							</ListItemIcon>
							{el.message === 0
								? `user ${el.senderId} followed you`
								: `user ${el.senderId} commented on your post`}
						</MenuItem>
					))}
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
					<MenuItem onClick={() => this.navTo(`/user/${user.username}/favorites`)}>
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
