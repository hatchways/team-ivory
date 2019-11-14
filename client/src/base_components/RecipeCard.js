import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 500,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAdToCart = () => {
    fetch('api/cart', {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipeId: props.recipe.id
        })
    }).then((res)=>{
        return res.json() 
    }).then((cart)=>{
        console.log(cart)
    })
  }
  return (
    <Card className={classes.card+' '+props.className} id={props.id}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.recipe.name.charAt(0)}
          </Avatar>
        }
        title={props.recipe.name}
        subheader="September 14, 2016"
        action={
          <IconButton aria-label="settings" onClick={handleAdToCart}>
            <AddShoppingCartIcon />
          </IconButton>
        }
      />
      <CardMedia
        className={classes.media}
        image={props.recipe.imageUrl}
        title={props.recipe.name}
      />
      <CardActions disableSpacing style={{flexWrap: 'wrap'}}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        {props.recipe.tags.map((tag, index) => (
            <a href='' key={index}>#{tag}</a>
        ))}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Ingredients:</Typography>
          {props.recipe.ingredients.map((ingredient, index)=>(
              <Typography paragraph key={index}>{ingredient.quantity} {ingredient.unit.label}{ingredient.quantity>1&&'s'} of {ingredient.ingredient.label}</Typography>
          ))}
          <Typography paragraph>Steps:</Typography>
          {props.recipe.steps.map((step, index)=>(
              <Typography paragraph key={index}>{index+1}. {step}</Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
