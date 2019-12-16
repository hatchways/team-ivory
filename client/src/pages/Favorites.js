import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RecipeCard from '../base_components/RecipeCard';

const useStyles = makeStyles(theme => ({
	recipeCard: {
		marginTop: '2rem',
		margin: 'auto',
	},
}));

const Favorites = ({ user }) => {
	const classes = useStyles();
	const [favorites, setFavorites] = useState([]);
	const [fetched, setFetched] = useState(false);

	useEffect(() => {
		setFetched(false);
		if (user) fetchFavorites();
	}, [user]);

	// fetches user's favorites from /user/:username/favorites
	const fetchFavorites = async () => {
		try {
			const res = await fetch('favorites', {
				method: 'GET',
			});
			const { favorites } = await res.json();
			console.log("FAVORITES", favorites)
			setFetched(true);
			setFavorites(favorites);
		} catch (e) {
			console.error(e);
		}
	};

	// deletes a recipe
	const handleRemove = async recipeId => {
		console.log(typeof recipeId);
		try {
			const res = await fetch('favorites/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ recipeId }),
			});
			if (res.status === 200) {
				const newFavorites = favorites.filter(favorite => favorite.id !== recipeId);
				setFavorites(newFavorites);
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div>
			{user ? <h1>{user.name}'s Favorites!</h1> : ''}
			{fetched ? (
				favorites.map(favorite => (
					<RecipeCard
						key={favorite.id}
						recipe={favorite}
						page={'favorites'}
						className={classes.recipeCard}
						remove={handleRemove}
					/>
				))
			) : (
				<h1>Loading Favorites...</h1>
			)}
		</div>
	);
};

export default Favorites;
