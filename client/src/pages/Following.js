import React, { Component } from 'react';
import Recipes from './Recipes';

export default class Following extends Component {
	state = { recipes: [] };

	async componentDidMount() {
		console.log('Hello');
		const res = await fetch('/api/recipes/following');
		const data = await res.json();
		console.log(res);
		console.log(data);
		this.setState({ recipes: data });
	}

	render() {
		const { recipes } = this.state;
		return (
			<div>
				<Recipes recipes={recipes} />
			</div>
		);
	}
}
