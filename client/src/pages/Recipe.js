import React, { useState, useEffect } from 'react';
import Comments from './Comments';

const Recipe = props => {
	const [recipeArray, setRecipeArray] = useState(null);
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
			setRecipeArray(recipe);
			setComments(comments);
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<div>
			{recipeArray ? (
				<div>
					<h1>{recipeArray.name}</h1>
					<p>Created on : {recipeArray.createdAt}</p>
					<p>Updated on : {recipeArray.updatedAt}</p>

					<img src={recipeArray.image} alt={''} />
					<p>steps: {recipeArray.steps.map(step => step)}</p>
					<p>tags: {recipeArray.tags.map(tag => tag)}</p>
				</div>
			) : (
				<div>Loading...</div>
			)}
			<Comments recipe={recipeArray} comments={comments} user={props.user} />
		</div>
	);
};

export default Recipe;
