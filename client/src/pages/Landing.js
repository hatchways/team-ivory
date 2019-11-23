import React, { Component } from 'react';
import utils from '../utils';

import { withStyles } from '@material-ui/core/styles';
import Feed from '../base_components/Feed';

const landinPageStyle = theme => ({
	landingContainer: {
		margin: theme.spacing.unit * 2,
	},
});

class LandingPage extends Component {
	state = {
		testUser:
			'Client did not fetch test user from database (check your code)',
		welcomeMessage: 'Step 1: Run the server and refresh (not running)',
		step: 0,
		recipes: [],
		sorted: false,
		sortedBy: null,
		sortDirection: 'desc',
	};

	componentDidMount() {
		fetch('api/recipes', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => {
				return res.json();
			})
			.then(recipes => {
				this.setState({ recipes: recipes });
			});
	}

	incrementStep = () => {
		this.setState(prevState => ({ step: (prevState.step += 1) }));
	};

	sort = e => {
		let sortBy;
		let direction;
		if (e.target.value === 'asc' || e.target.value === 'desc') {
			sortBy = this.state.sortedBy;
			direction = e.target.value;
		} else {
			sortBy = e.target.value;
			direction = this.state.sortDirection;
		}

		const sortedRecipes = utils.sort(this.state.recipes, sortBy, direction);
		this.setState({
			recipes: sortedRecipes,
			sorted: true,
			sortedBy: sortBy,
			sortDirection: direction,
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.landingContainer}>
				<select onChange={this.sort}>
					<option value="" selected disabled>
						Sort By
					</option>
					<option value="name">Name</option>
					<option value="id">Date Created</option>
					<option value="likes">Popularity</option>
				</select>{' '}
				{this.state.sorted ? (
					<select onChange={this.sort}>
						<option value="asc">Ascending</option>
						<option value="desc" selected>
							Descending
						</option>
					</select>
				) : (
					''
				)}
				<Feed recipes={this.state.recipes} user={this.props.user} />
			</div>
		);
	}
}

export default withStyles(landinPageStyle)(LandingPage);
