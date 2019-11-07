import React, { Component } from 'react';

import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Route, Link } from 'react-router-dom';

const landinPageStyle = theme => ({
	landingContainer: {
		margin: theme.spacing.unit * 2,
	},
});

class Signup extends Component {
	state = { username: '', password: '', passwordConfirm: '', first: '', last: '',
		email: '',  };

	async login(evt) {
		// Prevent page reload
		evt.preventDefault();
		const { username, password, first, last, email, passwordConfirm } = this.state;
		const res = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password, first, last, email, passwordConfirm }),
		}).catch(err => console.log(err));
		const data = await res.json();
		console.log(data);
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.landingContainer}>
				<form onSubmit={e => this.login(e)}>
					<input
						placeholder='username'
						onChange={e => this.setState({ username: e.target.value })}
					/>
					<input
						placeholder='first name'
						onChange={e => this.setState({ first: e.target.value })}
					/>
					<input
						placeholder='last name'
						onChange={e => this.setState({ last: e.target.value })}
					/>
					<input
						/*type='email'*/ placeholder='email'
						onChange={e =>
							this.setState({ email: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='password'
						onChange={e =>
							this.setState({ password: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='confirm password'
						onChange={e =>
							this.setState({ passwordConfirm: e.target.value })
						}
					/>
					<input type='submit' />
				</form>
			</div>
		);
	}
}

export default withStyles(landinPageStyle)(Signup);
