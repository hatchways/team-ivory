import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
	root: {
		display: 'flex',
		backgroundColor: theme.palette.secondary.light,
		overflow: 'hidden',
	},
	container: {
		marginTop: theme.spacing(10),
		marginBottom: theme.spacing(15),
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	item: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: theme.spacing(0, 5),
	},
	title: {
		marginBottom: theme.spacing(14),
	},
	number: {
		fontSize: 24,
		fontFamily: theme.typography.fontFamily,
		color: theme.palette.secondary.main,
		fontWeight: theme.typography.fontWeightMedium,
	},
	image: {
		height: 150,
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
	},
	curvyLines: {
		pointerEvents: 'none',
		position: 'absolute',
		top: -180,
		opacity: 0.7,
	},
	button: {
		marginTop: theme.spacing(8),
	},
});

function HowItWorks(props) {
	const { classes } = props;

	return (
		<section className={classes.root}>
			<Container className={classes.container}>
				<img
					src="/static/themes/onepirate/productCurvyLines.png"
					className={classes.curvyLines}
					alt="curvy lines"
				/>
				<Typography variant="h4" marked="center" className={classes.title} component="h2">
					How it works
				</Typography>
				<div>
					<Grid container spacing={5}>
						<Grid item xs={12} md={4}>
							<div className={classes.item}>
								<div className={classes.number}>1.</div>
								<img
									src="/images/icons8-book-shelf-100.png"
									alt="suitcase"
									className={classes.image}
								/>
								<Typography variant="h5" align="center">
									Discover or share recipes with other members.
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12} md={4}>
							<div className={classes.item}>
								<div className={classes.number}>2.</div>
								<img
									src="/images/icons8-ingredients-100.png"
									alt="graph"
									className={classes.image}
								/>
								<Typography variant="h5" align="center">
									Want to try a recipe? Adding it to your cart autopopulates the
									right amount of ingredients needed.
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12} md={4}>
							<div className={classes.item}>
								<div className={classes.number}>3.</div>
								<img
									src="/images/icons8-exercise-100.png"
									alt="clock"
									className={classes.image}
								/>
								<Typography variant="h5" align="center">
									{'Checkout with Kroger for a simplified shopping experience.'}
									{
										"You won't have to waste time searching for the right ingredients."
									}
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
				<Button
					color="secondary"
					size="large"
					variant="contained"
					className={classes.button}
					component="a"
					href="/signup/">
					Get started
				</Button>
			</Container>
		</section>
	);
}

HowItWorks.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HowItWorks);
