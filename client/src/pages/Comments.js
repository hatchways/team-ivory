import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { Menu, MenuItem, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles({
	container: {
		margin: 'auto',
		maxWidth: '1000px',
		minWidth: '800px',
		'margin-bottom': '50px',
	},
	newComment: {},
	commentInput: {
		width: '100%',
	},
	comment: {
		border: '1px solid #00000020',
		padding: '5px',
	},
	commentHeader: {
		display: 'flex',
	},
	optionsButton: {
		float: 'right',
	},
	posted: {
		color: 'gray',
		fontSize: '14px',
		padding: '5px',
		margin: 0,
	},
	editButtons: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	menuIcon: {
		marginRight: '10px',
	},
});

const Comments = ({ recipe, comments, user, socket }) => {
	const classes = useStyles();
	const [input, setInput] = useState('');
	const [commentsArray, setCommentsArray] = useState(null);
	const [editCommentId, setEditCommentId] = useState(null);

	useEffect(() => {
		setCommentsArray(comments);
	}, [comments]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const res = await fetch(`/comment/post`, {
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

			if (res.status === 200) {
				const data = await res.json();
				const newComment = {
					userId: user.id,
					recipeId: recipe.id,
					username: user.user,
					text: input,
					created: date,
					updated: date,
					id: data.commentId,
				};

				const notification = {
					userId: data.userId,
					senderId: user.id,
					senderUser: user.user,
					message: 1,
					recipeId: recipe.id,
				};
				socket.emit('comment', notification, res => {
				});
				setCommentsArray([newComment, ...commentsArray]);
				setInput('');
			} else throw new Error('Error inserting comment ', res);
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
			<form onSubmit={handleSubmit} className={classes.newComment}>
				<TextField
					className={classes.commentInput}
					onChange={handleInput}
					value={input}
					placeholder={'Add a public comment...'}
				/>
				<div className={classes.editButtons}>
					<Button onClick={() => setInput('')}>Cancel</Button>
					<Button type="submit">Comment</Button>
				</div>
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
	const classes = useStyles();
	const [text, setText] = React.useState(comment.text);

	const handleInput = e => {
		setText(e.target.value);
	};

	const handleSave = () => {
		if (text !== '') save(comment.id, text);
	};

	return (
		<div className={classes.comment} key={comment.created}>
			<div>
				<NavLink to={`/user/${comment.username}`}>{comment.username}</NavLink>
			</div>
			<TextField className={classes.commentInput} value={text} onChange={handleInput} />
			<div className={classes.editButtons}>
				<Button onClick={cancel}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
};

const Comment = ({ comment, user, handleEdit, handleDelete }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const date = new Date(comment.created);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className={classes.comment} key={comment.created}>
			{comment.userId === user.id ? (
				<React.Fragment>
					<div className={classes.optionsButton}>
						<Button onClick={handleClick} value={comment.id}>
							<MoreVertIcon />
						</Button>
						<Menu
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}>
							<MenuItem onClick={() => handleEdit(anchorEl.value)}>
								<EditRoundedIcon className={classes.menuIcon} fontSize="small" />
								Edit
							</MenuItem>
							<MenuItem
								onClick={() => {
									setAnchorEl(null);
									handleDelete(anchorEl.value);
								}}>
								<DeleteIcon className={classes.menuIcon} fontSize="small" />
								Delete
							</MenuItem>
						</Menu>
					</div>
				</React.Fragment>
			) : null}
			<div className={classes.commentHeader}>
				<NavLink to={`/user/${comment.username}`}>{comment.username}</NavLink>
				<label
					className={
						classes.posted
					}>{`${date.getMonth()}-${date.getDate()}-${date.getFullYear()} ${
					comment.created !== comment.updated ? '(edited)' : ''
				}`}</label>
			</div>
			{comment.text}
		</div>
	);
};

export default Comments;
