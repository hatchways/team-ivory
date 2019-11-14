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
    const [recipes, setRecipes] = React.useState([]);
   
    React.useEffect(() => {
        fetch('api/recipes', {
            method: 'get',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(props.query)
        }).then((res)=>{
            return res.json() 
        }).then((recipes)=>{
            setRecipes(recipes)
        })
    }, []);

    return (
        <div>
            {recipes.map((recipe)=> (
                <RecipeCard
                recipe={recipe}
                className={classes.recipeCard}
                />
            ))}
        </div>
    )
}
