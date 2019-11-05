import React, { Component } from 'react'
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import '../css/navbar.css'

export default class AppNavbar extends Component {
    navbarStyle = {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        zIndex:3,
        backgroundColor: 'limegreen'

    }

    render() {
        return (
            <Navbar expand="lg" style={this.navbarStyle}>
                <Navbar.Brand to='/'>
                    <Link className='navLink' style={this.navlinkStyle} to='/'>Recipe</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav>
                            <Link className='navLink' style={this.navlinkStyle} to='/builder'>Builder</Link>
                        </Nav>
                        <Nav>
                            <Link className='navLink' style={this.navlinkStyle} to='/notifications'>Notifications</Link>
                        </Nav>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button className='navSearch' variant="outline-info">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
