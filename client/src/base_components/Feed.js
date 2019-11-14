import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import RecipeCard from './RecipeCard'


const useStyles = makeStyles(theme => ({
    recipeCard: {
        marginTop: '2rem',
        margin: 'auto'
    },
}));

export default function Feed(props) {
    const classes = useStyles();

    return (
        <div>
            {props.recipes.map((recipe)=> (
                <RecipeCard
                recipe={recipe}
                className={classes.recipeCard}
                />
            ))}
        </div>
    )
}
