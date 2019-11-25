import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import utils from '../utils';
import RecipeCard from '../base_components/RecipeCard';

const useStyles = makeStyles(theme => ({
	recipeCard: {
		marginTop: '2rem',
		margin: 'auto',
	},
}));

export default function Recipes(props) {
	const classes = useStyles();

	const recipeCards =
		props.recipes.length > 0
			? props.recipes.map(recipe => (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						user={props.user}
						page={'feed'}
						className={classes.recipeCard}
					/>
			  ))
			: '';

	return <div>{recipeCards}</div>;
}