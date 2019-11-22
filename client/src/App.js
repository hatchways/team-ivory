import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

import { theme } from './themes/theme';
import LandingPage from './pages/Landing';
import BuilderPage from './pages/Builder';
import Feed from './base_components/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User from './pages/User';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import AppNavbar from './base_components/Navbar';
import ChangePassword from './pages/ChangePassword';

import './App.css';

const history = createBrowserHistory();

class App extends Component {
	state = { user: null };

	componentDidMount() {
		this.updateUser();
	}

	updateUser() {
		// If jwt cookie set, get user from the cookie
		console.info('Updating user...');
		const jwt = Cookies.get('jwt');
		if (jwt) {
			const user = atob(jwt.split('.')[1]);
			this.setState({ user: JSON.parse(user) });
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
					<AppNavbar user={user} logout={() => this.logout()} />
					<div style={{ marginTop: '4rem' }}>
						<Route exact path="/" component={LandingPage} />
						<Route exact path="/builder" component={BuilderPage} />
						<Route exact path="/feed" component={Feed} />
						<Route exact path="/cart" component={Cart} />
						<Route exact path="/user/passwords/change" component={ChangePassword} />
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
								<User {...props} user={user} logout={() => this.logout()} />
							)}
						/>
					</div>
				</BrowserRouter>
			</MuiThemeProvider>
		);
	}
}

export default App;
