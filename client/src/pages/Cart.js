import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//styling
const cartPageStyle = theme => ({
	cartItem: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	cartContainer: {
		boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
		zIndex: 3,
		marginTop: '2rem',
		padding: '0',
		minHeight: 600,
	},
	header: {
		backgroundColor: 'rgb(255, 198, 93)',
		textAlign: 'center',
		padding: '0.5rem',
	},
	content: {
		padding: '0.5rem',
		position: 'relative',
		minHeight: 'inherit',
	},
	checkoutButton: {
		position: 'absolute',
		bottom: '1rem',
		right: '1rem',
	},
});
class Cart extends Component {
	state = {
		cart: [],
	};

	componentDidMount() {
		console.log(this.props.location.pathname.split('/').pop());
		fetch('api/cart', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => {
				return res.json();
			})
			.then(cart => {
				this.setState({ cart: cart.ingredients });
			});
	}

	removeItem = itemId => {
		fetch('api/cart', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				itemId: itemId,
			}),
		})
			.then(res => {
				return res.json();
			})
			.then(json => {
				this.setState({
					cart: this.state.cart.filter(item => {
						return item.id !== itemId;
					}),
				});
			});
	};

	checkout = () => {
		fetch('/', {
			//placeholder until outside api integration
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ids: this.state.cart.map(item => {
					return item.outsideId;
				}),
			}),
		}).then(res => {
			fetch('api/cart', {
				method: 'delete',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(res => {
					return res.json();
				})
				.then(json => {
					this.setState({
						cart: [],
					});
				});
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.cartContainer + ' container'}>
				<h1 className={classes.header}>Cart</h1>
				<div className={classes.content}>
					{this.state.cart.map(item => (
						<div className={classes.cartItem}>
							<strong>{item.name}</strong>
							<IconButton
								aria-label="remove item"
								onClick={() => this.removeItem(item.id)}>
								<CancelIcon />
							</IconButton>
						</div>
					))}
					<Button
						onClick={this.checkout}
						style={{ height: '2.5rem' }}
						color="primary"
						variant="contained"
						className={classes.checkoutButton}>
						Checkout
					</Button>
				</div>
			</div>
		);
	}
}

export default withStyles(cartPageStyle)(Cart);
