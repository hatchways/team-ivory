import React, { Component } from 'react';
import { Nav, Navbar, Form, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/navbar.css';

export default class AppNavbar extends Component {
	navbarStyle = {
		boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
		zIndex: 3,
		backgroundColor: 'limegreen',
	};

	render() {
		return (
			<Navbar expand="lg" style={this.navbarStyle} fixed="top">
				<Navbar.Brand to="/">
					<Link className="navLink" style={this.navlinkStyle} to="/">
						Ingridify
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav>
              <Link className='navLink' style={this.navlinkStyle} to='/feed'>Feed</Link>
          </Nav>
					<Nav className="mr-auto">
						{this.props.user ? (
							<SignedIn
								name={this.props.user.name}
								username={this.props.user.user}
								logout={this.props.logout}
							/>
						) : (
							<AnonUser />
						)}
					</Nav>
					<Form inline>
						<FormControl type="text" placeholder="Search" className="mr-sm-2" />
						<Button className="navSearch" variant="outline-info">
							Search
						</Button>
					</Form>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

class SignedIn extends Component {
	render() {
		return (
			<React.Fragment>
				<Nav>
					<Link className="navLink" style={this.navlinkStyle} to="/builder">
						Builder
					</Link>
				</Nav>
				<Nav>
					<Link className="navLink" style={this.navlinkStyle} to="/notifications">
						Notifications
					</Link>
				</Nav>
				<Nav>
					<Link className="navLink" style={this.navlinkStyle} to="/cart">
						Cart
					</Link>
				</Nav>
				<Nav>
					<DropdownButton
						id="userDropDownMenu"
						size="sm"
						variant="Success"
						className="navbar-custom"
						style={{ alignSelf: 'center', color: 'white' }}
						title={this.props.name}>
						<Dropdown.Item href={`/user/${this.props.username}`}>
							{this.props.username}
						</Dropdown.Item>
						<Dropdown.Item href={`/user/${this.props.username}/favorites`}>
							Favorites
						</Dropdown.Item>
						<Dropdown.Item href={'/profile'}>Edit Profile</Dropdown.Item>
						<Dropdown.Item as="button" onClick={this.props.logout}>
							Sign out
						</Dropdown.Item>
					</DropdownButton>
				</Nav>
			</React.Fragment>
		);
	}
}

class AnonUser extends Component {
	render() {
		return (
			<React.Fragment>
				<Link className="navLink" style={this.navlinkStyle} to="/login">
					Login/Sign up
				</Link>
			</React.Fragment>
		);
	}
}
