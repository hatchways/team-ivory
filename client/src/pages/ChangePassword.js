import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const ChangePasswordStyle = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
};

class ChangePassword extends Component {
	state = {
		oldPassword: { name: 'oldPassword', value: '', label: 'Current Password', error: null },
		newPassword: { name: 'newPassword', value: '', label: 'New Password', error: null },
		confirm: { name: 'confirm', value: '', label: 'Confirm New Password', error: null },
	};

	// Update the value in password object
	updateField(field, value) {
		let item = this.state[field];
		item['value'] = value;
		if (item.name === 'confirm') {
			if (item.value !== this.state.newPassword.value) item.error = 'Passwords must match';
			else item.error = null;
		}
		this.setState({ [field]: item });
	}

	async requestUpdate(e) {
		e.preventDefault();
		console.log('Checking input...');
		const { oldPassword, newPassword, confirm } = this.state;
		console.log(oldPassword, newPassword, confirm);
		// Do not send requests with bad input
		if (oldPassword.error || newPassword.error || confirm.error) {
			console.error('Bad input. No request to server will be sent.');
			return;
		}
		console.info('No input errors detected.');
		const res = await fetch('/user/passwords/change', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				oldPassword: oldPassword.value,
				newPassword: newPassword.value,
			}),
		});
		if (res.status === 200) {
			this.props.history.push('/profile');
		}
	}

	render() {
		const { classes } = this.props;
		const { oldPassword, newPassword, confirm } = this.state;
		return (
			<form className={classes.container} onSubmit={e => this.requestUpdate(e)}>
				{[oldPassword, newPassword, confirm].map(el => {
					return (
						<TextField
							key={el['name']}
							error={!!el['error']}
							helperText={el['error']}
							required
							value={el['value']}
							onChange={e => this.updateField(el['name'], e.target.value)}
							type="password"
							margin="normal"
							variant="outlined"
							label={el['label']}
						/>
					);
				})}
				<Button style={{ margin: '10px' }} variant="outlined" type="submit">
					Update Password
				</Button>
			</form>
		);
	}
}

export default withStyles(ChangePasswordStyle)(ChangePassword);
