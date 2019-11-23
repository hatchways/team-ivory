import React, { useState, useEffect } from 'react';

const Favorites = ({ user }) => {
	const [favoritesArray, setFavoritesArray] = useState([]);
	const [fetched, setFetched] = useState(false);

	useEffect(() => {
		setFetched(false);
		if (user) fetchFavorites();
	}, [user]);

	const fetchFavorites = async () => {
		const res = await fetch('favorites', {
			method: 'GET',
		});
		const { favorites } = await res.json();
		console.log(favorites);
		setFavoritesArray(favorites);
		setFetched(true);
	};

	const handleRemove = async e => {
		const recipeId = e.target.value;
		const res = await fetch('favorites/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ recipeId }),
		});
		const response = await res.json();
		const newFavorites = favoritesArray.filter(
			favorite => favorite.recipe.id !== parseInt(recipeId)
		);
		setFavoritesArray(newFavorites);
	};

	return (
		<div>
			{user ? <h1>{user.name}'s Favorites!</h1> : ''}
			{fetched ? (
				favoritesArray.map(favorite => (
					<p>
						<img
							src={favorite.recipe.image}
							style={{ width: '200px' }}
							alt={favorite.recipe.name}
						/>{' '}
						{favorite.recipe.name}{' '}
						<button
							onClick={handleRemove}
							value={favorite.recipe.id}>
							Remove
						</button>
					</p>
				))
			) : (
				<h1>Loading Favorites...</h1>
			)}
		</div>
	);
};

export default Favorites;
