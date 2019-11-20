import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { nominalTypeHack } from 'prop-types';

const ProfileStyles = theme => ({
	container: {
		margin: theme.spacing(2),
		margin: '20px',
		padding: '10px',
		border: 'solid 2px #000000',
		borderRadius: '5px',
		'box-shadow': '5px 6px 0px #E0E0E0',
		display: 'flex',
		alignItems: 'center',
	},
	editButton: {
		border: 'none',
		color: 'blue',
		padding: 5,
		margin: 0,
		background: '#ffffff',
	},
	profilePic: {
		marginLeft: '10px',
		width: '150px',
		height: '150px',
		'border-radius': '50%',
		border: '2px solid #000000',
	},
	userData: {
		marginLeft: '25px',
	},
	propertyName: {
		'font-weight': 'bold',
		width: '150px',
	},
	property: {
		width: '200px',
	},
});

class Field {
	constructor(field, value, editable) {
		this.field = field;
		this.value = value;
		this.editable = editable;
	}
}

class Profile extends Component {
	state = {
		editing: false,
		fields: [],
		editing: '',
	};

	async componentDidMount() {
		const res = await fetch('/user/profile');
		if (res.status === 200) {
			const data = await res.json();
			console.log(data);
			const { user } = data;
			const date = new Date(user.createdAt);
			this.setState({
				fields: [
					new Field('First Name', user.firstName, true),
					new Field('Last Name', user.lastName, true),
					new Field('Email', user.email, true),
					new Field('Username', user.username, false),
					new Field('Member Since', `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`, false),
				],
			});
		}
	}

	openEditing(field) {
		this.setState({ editing: field });
	}

	async updateUser(field, value) {
		this.setState({ editing: null });
		if (['First Name', 'Last Name', 'Email'].includes(field)) {
			console.log(field, value);
			const res = fetch('/user/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ field, value }),
			});
			if (res.status === 200) {
				// TODO add pop up to notify user
			}
		}
	}

	render() {
		const { editing, fields, status } = this.state;
		const { classes } = this.props;
		console.log(editing);
		return (
			<div className={classes.container}>
				<div className={classes.profilePic}></div>
				<div className={classes.userData}>
					<h2>Edit Profile</h2>
					{fields.map(field => {
						return (
							<LineItem
								key={field.field}
								label={field.field}
								value={field.value}
								classes={classes}
								edit={field => this.openEditing(field)}
								save={(field, value) => this.updateUser(field, value)}
								editable={field.editable}
								editing={editing === field.field ? true : false}
							/>
						);
					})}
					<label>{status}</label>
					<button>Change Password</button>
					<br />
				</div>
			</div>
		);
	}
}

class LineItem extends Component {
	constructor(props) {
		super(props);
		this.state = { editing: false, field: this.props.value };
	}

	componentDidUpdate(lastProps) {
		if (lastProps !== this.props) {
			this.setState({ field: this.props.value });
		}
	}

	render() {
		const { classes, label, value, editable, edit, editing, save } = this.props;
		const { field } = this.state;
		return (
			<React.Fragment>
				<label className={classes.propertyName}>{label}</label>
				{!editing ? (
					<label className={classes.property}>{value}</label>
				) : (
					<input value={field} onChange={e => this.setState({ field: e.target.value })} />
				)}
				{editable ? (
					editing ? (
						<EditingOptions classes={classes} edit={edit} save={() => save(label, field)} />
					) : (
						<button onClick={() => edit(label)} className={classes.editButton}>
							Edit
						</button>
					)
				) : null}
				<br />
			</React.Fragment>
		);
	}
}

class EditingOptions extends Component {
	render() {
		const { classes, edit, save } = this.props;
		return (
			<React.Fragment>
				<button className={classes.editButton} onClick={save}>
					Save
				</button>
				<button className={classes.editButton} onClick={() => edit(null)}>
					Cancel
				</button>
			</React.Fragment>
		);
	}
}

export default withStyles(ProfileStyles)(Profile);
