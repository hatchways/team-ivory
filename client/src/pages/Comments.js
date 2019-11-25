import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Comments = ({ recipe, comments, user }) => {
	const [input, setInput] = useState('');
	const [commentsArray, setCommentsArray] = useState(null);

	useEffect(() => {
		console.log(user);
		setCommentsArray(comments);
	}, [comments]);

	const handleSubmit = e => {
		e.preventDefault();
		console.log('SUBMITTING');
		try {
			const res = fetch(`/comment/post`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					recipeId: recipe.id,
					text: input,
				}),
			});
			const date = new Date().toString();
			const newComment = {
				userId: user.id,
				recipeId: recipe.id,
				username: user.user,
				text: input,
				created: date,
				updated: date,
			};
			setCommentsArray([newComment, ...commentsArray]);
			setInput('');
		} catch (e) {
			console.error(e);
		}
	};

	const handleInput = e => {
		setInput(e.target.value);
	};

	const handleDelete = e => {
		const commentId = e.target.value;
		try {
			const res = fetch(`/comment/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: commentId,
				}),
			});
			const newComments = commentsArray.filter(comment => comment.id !== parseInt(commentId));
			setCommentsArray(newComments);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div>
			<h1>Comments</h1>
			<form onSubmit={handleSubmit}>
				<input
					onChange={handleInput}
					value={input}
					placeholder={'Please type your comment'}></input>
				<button type="submit">Submit</button>
			</form>
			{commentsArray ? (
				<React.Fragment>
					<div>
						{commentsArray.map(comment => (
							<div style={{ border: '1px solid black' }} key={comment.created}>
								{comment.id ? (
									comment.userId === user.id ? (
										<button
											onClick={handleDelete}
											value={comment.id}
											style={{ float: 'right' }}>
											X
										</button>
									) : (
										''
									)
								) : (
									<i style={{ float: 'right' }}>recently added</i>
								)}
								<div>
									<NavLink to={`/user/${comment.username}`}>
										{comment.username}
									</NavLink>
								</div>
								<div>created on: {comment.created}</div>
								<div>edited on: {comment.updated}</div>
								{comment.text}
							</div>
						))}
					</div>
				</React.Fragment>
			) : (
				''
			)}
		</div>
	);
};

export default Comments;
