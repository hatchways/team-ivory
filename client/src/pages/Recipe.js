import React, { useState, useEffect } from 'react';

const Recipe = () => {
	const [recipe, setRecipe] = useState(null);
	useEffect(() => {
		console.log(window.location.pathname);
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
			const fetche = await response.json();
			console.log(fetche);
			setRecipe(fetche);
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<div>
			{recipe ? (
				<div>
					<h1>{recipe.name}</h1>
					<p>Created on : {recipe.createdAt}</p>
					<p>Updated on : {recipe.updatedAt}</p>

					<img src={recipe.image} alt={''} />
					<p>steps: {recipe.steps.map(step => step)}</p>
					<p>tags: {recipe.tags.map(tag => tag)}</p>
				</div>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default Recipe;
