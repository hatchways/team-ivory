import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import { theme } from './themes/theme';
import LandingPage from './pages/Landing';
import BuilderPage from './pages/Builder';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User from './pages/User';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import AppNavbar from './base_components/Navbar';
import ChangePassword from './pages/ChangePassword';
import Favorites from './pages/Favorites';
import Recipe from './pages/Recipe';
import Following from './pages/Following';

import './App.css';

const history = createBrowserHistory();

const socket = io('http://localhost:3000');

class App extends Component {
	state = { user: null };

	componentDidMount() {
		console.log('Connected? ', socket.connected);
		this.updateUser();
	}

	updateUser() {
		// If jwt cookie set, get user from the cookie
		console.info('Updating user...');
		const jwt = Cookies.get('jwt');
		if (jwt) {
			const user = JSON.parse(atob(jwt.split('.')[1]));

			socket.on('connect', data => {
				console.log('connected to socket');
				socket.emit('user', user);
			});

			this.setState({ user });
		}
	}

	async logout() {
		console.info('Signing out...');
		const res = await fetch('/user/signout', { method: 'POST' });
		console.log(await res.json());
		history.push('/login');
		this.setState({ user: null });
		history.go();
	}

	render() {
		console.log('Rerending main app.');
		const { user } = this.state;
		return (
			<MuiThemeProvider theme={theme}>
				<BrowserRouter>
					<Route
						render={props => (
							<AppNavbar
								{...props}
								user={user}
								logout={() => this.logout()}
								socket={socket}
							/>
						)}
					/>
					<Route
						exact
						path="/"
						render={props => <LandingPage {...props} user={user} />}
					/>
					<Route exact path="/builder" component={BuilderPage} />
					<Route
						exact
						path="/feed"
						render={props => <Feed {...props} user={user} socket={socket} />}
					/>
					<Route exact path="/cart" component={Cart} />
					<Route
						exact
						path="/recipe/:recipeId"
						render={props => <Recipe {...props} user={user} socket={socket} />}
					/>
					<Route
						exact
						path="/user/:username/favorites"
						render={props => <Favorites {...props} user={user} />}
					/>
					<Route exact path="/user/passwords/change" component={ChangePassword} />
					<Route exact path="/following" component={Following} />
					<Route
						exact
						path="/login"
						render={props => (
							<Login
								{...props}
								updateUser={() => this.updateUser()}
								username={this.state}
							/>
						)}
					/>
					<Route exact path="/signup" component={Signup} />
					<Route
						exact
						path="/profile"
						render={props => (
							<Profile {...props} updateUser={() => this.updateUser()} />
						)}
					/>
					<Route
						exact
						path={`/user/:username`}
						render={props => (
							<User
								{...props}
								user={user}
								socket={socket}
								logout={() => this.logout()}
							/>
						)}
					/>
				</BrowserRouter>
			</MuiThemeProvider>
		);
	}
}

export default App;
