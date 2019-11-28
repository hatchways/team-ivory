import React, { Component } from 'react';
import { Nav, Navbar, Form, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppBar, Button, Toolbar, IconButton, Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
	render() {
		const { user, classes, history } = this.props;
		console.log(user);
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
								<Button>Following</Button>
								<Button href="/builder">Post Recipe</Button>
								<div className={classes.grow}></div>
								<IconButton href="/notifications">
									<NotificationsIcon />
								</IconButton>
								<UserMenu
									user={user}
									history={history}
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
		const { user } = this.props;
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
					<MenuItem onClick={() => this.navTo(`/user/${user.username}/favorites`)}>
						Favorites
					</MenuItem>
					<MenuItem onClick={() => this.navTo('/cart')}>Cart</MenuItem>
					<MenuItem onClick={() => this.navTo('/profile')}>Account</MenuItem>
					<MenuItem onClick={this.props.logout}>Logout</MenuItem>
				</Menu>
			</div>
		);
	}
}

export default withStyles(Styles)(AppNavbar);
