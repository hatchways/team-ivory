import React, { Component } from 'react';

import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Route, Link } from 'react-router-dom';

const signupPageStyle = theme => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		'justify-content': 'center',
		'align-items': 'center',
	},
	formItem: {
		display: 'block',
		margin: '5px',
		padding: '5px',
		'border-radius': '5px',
	},
});

class Signup extends Component {
	state = {
		username: { value: '', name: 'username', label: 'Username', error: null },
		password: { value: '', name: 'password', label: 'Password', error: null },
		passwordConfirm: {
			value: '',
			name: 'passwordConfirm',
			label: 'Confirm Password',
			error: null,
			type: 'password',
		},
		first: { value: '', name: 'first', label: 'First Name', error: null },
		last: { value: '', name: 'last', label: 'Last Name', error: null },
		email: { value: '', name: 'email', label: 'Email', error: null },
	};

	// Send signup request to server
	async signup(evt) {
		// Prevent page reload
		evt.preventDefault();
		const { username, password, first, last, email, passwordConfirm } = this.state;
		console.log(username, password, first, last, email, passwordConfirm);
		const res = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: username.value,
				password: password.value,
				first: first.value,
				last: last.value,
				email: email.value,
				passwordConfirm: passwordConfirm.value,
			}),
		}).catch(err => {
			console.log('Error signing up: ', err);
			return;
		});
		const data = await res.json();
		console.log(data);
		if (res.status == 200) {
			this.props.history.push('/login');
		}
	}

	updateField(field, value) {
		let item = this.state[field];
		item['value'] = value;
		if (item.name === 'passwordConfirm') {
			if (item.value !== this.state.password.value) item.error = 'Passwords must match';
			else item.error = null;
		}
		this.setState({ [field]: item });
	}

	render() {
		const { classes } = this.props;
		const { username, password, first, last, email, passwordConfirm } = this.state;
		return (
			<div className={classes.signupPageStyle}>
				<form className={classes.form} onSubmit={e => this.signup(e)}>
					{[first, last, username, email, password, passwordConfirm].map(el => {
						return (
							<TextField
								key={el['name']}
								error={!!el['error']}
								helperText={el['error']}
								required
								value={el['value']}
								onChange={e => this.updateField(el['name'], e.target.value)}
								type={el['type'] ? el['type'] : el['name']}
								margin="dense"
								variant="outlined"
								label={el['label']}
							/>
						);
					})}
					<Button style={{ margin: '10px' }} type="submit" variant="outlined">
						Sign up
					</Button>
					<Link to="/login">Already have an account? Sign in here</Link>
				</form>
			</div>
		);
	}
}

export default withStyles(signupPageStyle)(Signup);
