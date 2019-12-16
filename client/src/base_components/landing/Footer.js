import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

function Copyright() {
	return (
		<React.Fragment>
			{'© '}
			<Link color="inherit" href="https://ingridify.com">
				Ingridify
			</Link>{' '}
			{new Date().getFullYear()}
		</React.Fragment>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		backgroundColor: theme.palette.secondary.light,
	},
	container: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(8),
		display: 'flex',
		textAlign: 'center',
	},
	iconsWrapper: {
		height: 120,
	},
	icons: {
		display: 'flex',
	},
	icon: {
		width: 48,
		height: 48,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.palette.warning.main,
		marginRight: theme.spacing(1),
		'&:hover': {
			backgroundColor: theme.palette.warning.dark,
		},
	},
	list: {
		margin: 0,
		listStyle: 'none',
		paddingLeft: 0,
	},
	listItem: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(0.5),
	},
	language: {
		marginTop: theme.spacing(1),
		width: 150,
	},
}));

export default function Footer() {
	const classes = useStyles();

	return (
		<Typography component="footer" className={classes.root}>
			<Container className={classes.container}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Typography variant="h6" marked="left" gutterBottom>
							Legal
						</Typography>
						<ul className={classes.list}>
							<li className={classes.listItem}>
								<Link href="#">Terms</Link>
							</li>
							<li className={classes.listItem}>
								<Link href="#">Privacy</Link>
							</li>
						</ul>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" marked="left" gutterBottom>
							About
						</Typography>
						<ul className={classes.list}>
							<li className={classes.listItem}>
								<Link href="#">Our Team</Link>
							</li>
							<li className={classes.listItem}>
								<Link href="#">Contact</Link>
							</li>
						</ul>
					</Grid>
					<Grid item xs={12}>
						<Copyright />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="caption">
							{'Bookshelf, ingredients, and exercise icons made by '}
							<Link href="https://icons8.com" rel="sponsored" title="Icons8">
								Icons8
							</Link>
							{' from '}
							<Link href="https://icons8.com" rel="sponsored" title="Icons8">
								https://icons8.com
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Typography>
	);
}
