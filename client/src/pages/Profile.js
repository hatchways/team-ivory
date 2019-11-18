import React, { Component } from 'react';

class Profile extends Component {
  state = { editing: false, user: { firstName: '', lastName: '', email: '', createdAt: '', email: '', username: '' } };

  async componentDidMount() {
    let res = await fetch('/user/profile');
    if (res.status === 200) {
      let data = await res.json();
      this.setState({ user: data.user });
    }
  }

  updateUser(user) {
    //TODO
  }

  render() {
    const { editing, user } = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        {!editing ? (
          <ProfileData user={user} edit={() => this.setState({ editing: true })} />
        ) : (
          <ProfileEdit user={user} cancel={() => this.setState({ editing: false })} save={u => console.log(u)} />
        )}
      </React.Fragment>
    );
  }
}

class ProfileData extends Component {
  render() {
    const { firstName, lastName, email, username, createdAt } = this.props.user;
    const { edit } = this.props;
    return (
      <div>
        <label>Name</label>
        <label>{`${firstName} ${lastName}`}</label>
        <br />
        <label>Email</label>
        <label>{email}</label>
        <br />
        <label>username</label>
        <label>{username}</label>
        <br />
        <label>Member since: </label>
        <label>{createdAt}</label>
        <br />
        <button onClick={edit}>Edit</button>
        <button>Change Password</button>
        <br />
      </div>
    );
  }
}

class ProfileEdit extends Component {
  state = { user: this.props.user };

  updateInput(field, value) {
    this.setState({ [field]: value });
  }

  render() {
    const { firstName, lastName, email, username, createdAt } = this.state.user;
    const { cancel, save } = this.props;
    return (
      <div>
        <label>Name</label>
        <input value={firstName} onChange={e => this.updateInput('firstName', e.target.value)} />
        <input value={lastName} onChange={e => this.updateInput('lastName', e.target.value)} />
        <br />
        <label>Email</label>
        <input value={email} onChange={e => this.updateInput('email', e.target.value)} />
        <br />
        <label>username</label>
        <label>{username}</label>
        <br />
        <label>Member since: </label>
        <label>{createdAt}</label>
        <br />
        <button onClick={() => save(this.state.user)}>Save</button>
        <button onClick={cancel}>Cancel</button>
      </div>
    );
  }
}

export default Profile;
