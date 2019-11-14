import React, { useState, useEffect } from "react";

const Favorites = ({ id, username, firstName }) => {
	const [favoritesArray, setFavoritesArray] = useState([]);

	useEffect(() => {
		fetchFavorites();
	}, []);

	const fetchFavorites = async () => {
		console.log(typeof id);
		const res = await fetch(`${username}/favorites`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id })
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
					<img src={favorite.image} /> {favorite.name}{" "}
				</p>
			))}
		</div>
	);
};

export default Favorites;
