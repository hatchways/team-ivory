import React, { useState, useEffect } from 'react';
import Comments from './Comments';
import { makeStyles } from '@material-ui/styles';
import { Container, Grid, Typography, Box, Chip } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
	container: {
		// margin: 'auto',
		// maxWidth: '1000px',
		// minWidth: '800px',
		background: 'white',
	},
	recipe: {
		display: 'flex',
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '1px solid #00000020',
	},
	image: {
		maxHeight: '400px',
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		border: '1px solid #00000030',
	},
	sectionHeader: {
		width: '90%',
		fontSize: '1.2em',
		borderBottom: '1px solid #00000020',
	},
	recipeTile: {
		flex: 1,
	},
	recipeInfo: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	step: {
		display: 'flex',
	},
	stepCount: {
		width: '30px',
		fontSize: '1em',
	},
	stepDirections: {},
	tag: {
		fontSize: '0.8em',
		fontWeight: 'bold',
		margin: '5px',
		background: '#79B473',
	},
});

const Recipe = props => {
	const classes = useStyles();
	const [recipeArray, setRecipeArray] = useState(null);
	const [postedDate, setPostedDate] = useState(null);
	const [updateDate, setUpdateDate] = useState(null);
	const [comments, setComments] = useState([]);

	useEffect(() => {
		fetchRecipe();
	}, []);

	const fetchRecipe = async () => {
		try {
			const response = await fetch(window.location.pathname, {
				method: 'get',
			});
			if (!response.ok)
				// or check for response.status
				throw new Error(response.statusText);
			const { recipe, comments } = await response.json();
			setPostedDate(new Date(recipe.createdAt));
			setUpdateDate(new Date(recipe.updatedAt));
			setRecipeArray(recipe);
			setComments(comments);
		} catch (e) {
			console.error(e);
		}
	};
	return (
		// <div className={classes.container}>
		<Container maxWidth="md" className={classes.container}>
			{recipeArray ? (
				<div className={classes.recipe}>
					<div className={clsx(classes.recipeTile, classes.recipeInfo)}>
						<div>
							<Typography>
								<Box
									lineHeight="normal"
									textAlign="center"
									fontSize="h3.fontSize"
									fontWeight="fontWeightBold">
									{recipeArray.name}
								</Box>
								<Box
									fontSize={12}
									textAlign="center"
									fontWeight="fontWeightLight"
									fontStyle="oblique">
									{`Posted: ${postedDate.getMonth()}-${postedDate.getDate()}-${postedDate.getFullYear()}`}
								</Box>
								<Box
									fontSize={12}
									textAlign="center"
									fontWeight="fontWeightLight"
									fontStyle="oblique">
									{`Updated: ${updateDate.getMonth()}-${updateDate.getDate()}-${updateDate.getFullYear()}`}
								</Box>
							</Typography>
							<h2 className={classes.sectionHeader}>Ingredients</h2>
							<p></p>
							<h2 className={classes.sectionHeader}>Directions</h2>
							{recipeArray.steps.map((step, ind) => (
								<div className={classes.step}>
									<label className={classes.stepCount}>{`${ind + 1}.`}</label>
									<label className={classes.stepDirections}>{step}</label>
								</div>
							))}
						</div>
						<div className={classes.tagsSection}>
							<h2 className={classes.sectionHeader}>Tags</h2>
							{recipeArray.tags.map(tag => (
								<Chip className={classes.tag} label={tag} variant="outlined" />
							))}
						</div>
					</div>
					<div className={clsx(classes.recipeTile, classes.image)}>
						<img src={recipeArray.image} alt={''} />
					</div>
				</div>
			) : (
				<div>Loading...</div>
			)}
			<Comments recipe={recipeArray} comments={comments} user={props.user} socket={props.socket} />
			{/* // </div> */}
		</Container>
	);
};

export default Recipe;
