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
		testUser: 'Client did not fetch test user from database (check your code)',
		welcomeMessage: 'Step 1: Run the server and refresh (not running)',
		step: 0,
		recipes: [],
		sorted: false,
		sortedBy: '',
		sortDirection: '',
		searched: false,
		searchedRecipes: [],
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

	handleSearch = e => {
		e.preventDefault();
		const searchTerm = e.target.value.toLowerCase();
		const searchedRecipes = this.state.recipes.filter(recipe =>
			recipe.name.toLowerCase().includes(searchTerm)
		);
		this.setState({
			searchedRecipes: searchedRecipes,
			searched: true,
			sorted: false,
			sortedBy: '',
		});
	};

	handleSort = e => {
		let sortBy;
		let direction;
		if (e.target.value === 'asc' || e.target.value === 'desc') {
			sortBy = this.state.sortedBy;
			direction = e.target.value;
		} else {
			sortBy = e.target.value;
			direction = 'desc';
		}
		const recipes = this.state.searched ? this.state.searchedRecipes : this.state.recipes;

		const sortedRecipes = utils.sort(recipes, sortBy, direction);
		this.state.searched
			? this.setState({
					searchedRecipes: sortedRecipes,
					sorted: true,
					sortedBy: sortBy,
					sortDirection: direction,
			  })
			: this.setState({
					recipes: sortedRecipes,
					sorted: true,
					sortedBy: sortBy,
					sortDirection: direction,
			  });
	};

	render() {
		const { classes, user } = this.props;
		const { recipes, searched, searchedRecipes, sorted, sortedBy, sortDirection } = this.state;
		let asc = 'Ascending';
		let desc = 'Descending';
		if (sortedBy === 'id') {
			asc = 'Oldest';
			desc = 'Newest';
		}
		if (sortedBy === 'name') {
			asc = 'A-Z';
			desc = 'Z-A';
		}
		if (sortedBy === 'likes') {
			asc = 'Lowest';
			desc = 'Highest';
		}
		return (
			<div className={classes.landingContainer}>
				<input placeholder="Search by name" onChange={this.handleSearch}></input>{' '}
				<select value={sortedBy} onChange={this.handleSort}>
					<option value="" selected disabled>
						Sort By
					</option>
					<option value="name">Name</option>
					<option value="id">Date Created</option>
					<option value="likes">Popularity</option>
				</select>{' '}
				<select value={sortDirection} disabled={!sorted} onChange={this.handleSort}>
					<option value="" selected disabled>
						Direction
					</option>
					<option value="asc">{asc}</option>
					<option value="desc" selected>
						{desc}
					</option>
				</select>
				<Feed recipes={searched ? searchedRecipes : recipes} user={user} />
			</div>
		);
	}
}

export default withStyles(landinPageStyle)(LandingPage);
