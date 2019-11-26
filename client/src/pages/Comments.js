import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Menu, MenuItem, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles({
	container: {
		padding: '0 30px',
	},
	comment: {},
});

const Comments = ({ recipe, comments, user }) => {
	const classes = useStyles();
	const [input, setInput] = useState('');
	const [commentsArray, setCommentsArray] = useState(null);
	const [editCommentId, setEditCommentId] = useState(null);

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

	// Sets the comment id of the comment being opened to edit
	const handleEdit = commentId => {
		setEditCommentId(commentId);
	};

	// Saves changes made during edit and updates frontend
	const saveChanges = (commentId, text) => {
		handleEdit(null);
		console.log(commentId, text);
		try {
			const res = fetch(`/comment/edit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: commentId,
					text: text,
				}),
			});
			// Update the text in the front end
			const newComments = commentsArray.map(comment => {
				if (comment.id === commentId) comment.text = text;
				return comment;
			});
			setCommentsArray(newComments);
		} catch (e) {
			console.error(e);
		}
	};

	const handleDelete = commentId => {
		console.log(commentId);
		// const commentId = e.target.value;
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
		<div className={classes.container}>
			<h1>Comments</h1>
			<form onSubmit={handleSubmit}>
				<input
					onChange={handleInput}
					value={input}
					placeholder={'Add a public comment...'}></input>
				<button type="submit">Submit</button>
			</form>
			{commentsArray ? (
				<React.Fragment>
					<div>
						{commentsArray.map(comment =>
							comment.id == editCommentId ? (
								<EditingComment
									comment={comment}
									save={(id, text) => saveChanges(id, text)}
									cancel={() => handleEdit(null)}
								/>
							) : (
								<Comment
									comment={comment}
									user={user}
									handleEdit={commentId => handleEdit(commentId)}
									handleDelete={commentId => handleDelete(commentId)}
								/>
							)
						)}
					</div>
				</React.Fragment>
			) : null}
		</div>
	);
};

const EditingComment = ({ comment, save, cancel }) => {
	const [text, setText] = React.useState(comment.text);

	const handleInput = e => {
		setText(e.target.value);
	};

	const handleSave = () => {
		if (text !== '') save(comment.id, text);
	};

	return (
		<div style={{ border: '1px solid black' }} key={comment.created}>
			<div>
				<NavLink to={`/user/${comment.username}`}>{comment.username}</NavLink>
			</div>
			<TextField style={{ width: '100%' }} value={text} onChange={handleInput} />
			<div>
				<Button onClick={cancel}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
};

const Comment = ({ comment, user, handleEdit, handleDelete }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div style={{ border: '1px solid black' }} key={comment.created}>
			{comment.id ? (
				comment.userId === user.id ? (
					<React.Fragment>
						<div style={{ float: 'right' }}>
							<Button onClick={handleClick} value={comment.id}>
								<MoreVertIcon />
							</Button>
							<Menu
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}>
								<MenuItem onClick={() => handleEdit(anchorEl.value)}>Edit</MenuItem>
								<MenuItem
									onClick={() => {
										setAnchorEl(null);
										handleDelete(anchorEl.value);
									}}
									value={comment.id}>
									Delete
								</MenuItem>
							</Menu>
						</div>
					</React.Fragment>
				) : null
			) : (
				<i style={{ float: 'right' }}>recently added</i>
			)}
			<div>
				<NavLink to={`/user/${comment.username}`}>{comment.username}</NavLink>
			</div>
			<div>created on: {comment.created}</div>
			<div>edited on: {comment.updated}</div>
			{comment.text}
		</div>
	);
};

export default Comments;
