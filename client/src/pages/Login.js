import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const loginPageStyle = theme => ({
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

class Login extends Component {
	state = {
		email: { value: 'test@test.com', label: 'Email', name: 'email', error: null },
		password: { value: 'test', label: 'Password', name: 'password', error: null },
	};

	// Send login request to server
	async login(evt) {
		// Prevent page reload
		evt.preventDefault();
		const { email, password } = this.state;
		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: email.value, password: password.value }),
		}).catch(err => console.log(err));
		const data = await res.json();
		console.log(data);
		if (res.status === 200) {
			this.props.updateUser();
			this.props.history.push(`/user/${data.username}`);
		}
	}

	updateField(field, value) {
		let item = this.state[field];
		item['value'] = value;
		this.setState({ [field]: item });
	}

	render() {
		const { classes } = this.props;
		const { email, password } = this.state;
		return (
			<div className={classes.loginPageStyle}>
				<form className={classes.form} onSubmit={e => this.login(e)}>
					{[email, password].map(el => {
						return (
							<TextField
								key={el['name']}
								error={!!el['error']}
								helperText={el['error']}
								required
								value={el['value']}
								onChange={e => this.updateField(el['name'], e.target.value)}
								type={el['name']}
								margin="normal"
								variant="outlined"
								label={el['label']}
							/>
						);
					})}

					<Button style={{ margin: '10px' }} type="submit" variant="outlined">
						Login
					</Button>
					<Link to="/signup">New? Signup here</Link>
				</form>
			</div>
		);
	}
}

export default withStyles(loginPageStyle)(Login);
