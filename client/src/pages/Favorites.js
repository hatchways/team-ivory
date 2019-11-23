import React, { useState, useEffect } from 'react';

const Favorites = ({ user }) => {
	const [favoritesArray, setFavoritesArray] = useState([]);
	const [fetched, setFetched] = useState(false)

	useEffect(() => {
		setFetched(false);
		if (user) setTimeout(fetchFavorites, 3000);
	}, [user]);

	const fetchFavorites = async () => {
		const res = await fetch("favorites", {
			method: "GET"
		});
		const { favorites } = await res.json();
		console.log(favorites);
		setFavoritesArray(favorites);
		setFetched(true);
	};

	return (
		<div>
			{user ? <h1>{user.name}'s Favorites!</h1> : ''}
			{fetched ? favoritesArray.map(favorite => (
				<p>
					<img src={favorite.recipe.image} style={{ width: "200px" }} /> {favorite.recipe.name}{" "}
				</p>
			)) : <h1>Loading Favorites...</h1>}
		</div>
	);
};

export default Favorites;
