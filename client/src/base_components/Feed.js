import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import RecipeCard from './RecipeCard';

const useStyles = makeStyles(theme => ({
	recipeCard: {
		marginTop: '2rem',
		margin: 'auto',
	},
}));

export default function Feed(props) {
	const classes = useStyles();

	return (
		<div>
			{props.recipes.length > 0
				? props.recipes.map(recipe => (
						<RecipeCard
							key={recipe.id}
							recipe={recipe}
							user={props.user}
							className={classes.recipeCard}
						/>
				  ))
				: ''}
		</div>
	);
}
