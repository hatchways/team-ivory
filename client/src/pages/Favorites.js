import React, { useState, useEffect } from "react";

const Favorites = ({ id, username, firstName }) => {
	const [favoritesArray, setFavoritesArray] = useState([]);

	useEffect(() => {
		fetchFavorites();
	}, []);

	const fetchFavorites = async () => {
		const res = await fetch(`${username}/favorites`, {
			method: "POST"
		});
		const { favorites } = await res.json();
		console.log(favorites);
		setFavoritesArray(favorites);
	};

	return (
		<div>
			<h1>{firstName}'s Favorites!</h1>
			{favoritesArray.map(favorite => (
				<p>
					<img src={favorite.recipe.image} /> {favorite.recipe.name}{" "}
				</p>
			))}
		</div>
	);
};

export default Favorites;
