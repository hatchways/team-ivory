/*Recipe Builder Page
  page used to build recipes for the app,
  it is divided into 3 tabs,
    1 an overview tab with a preview card, a name input and tag input
    2 an ingredient tab for adding ingredients
    3 a step tab for adding steps
*/

import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { Tabs, Tab } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import RecipeCard from '../base_components/RecipeCard';
import Upload from '../base_components/Upload';
import '../css/builder.css';

import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

//placeholders until backend is built
var getIngredients = searchTerm => {
  return Promise.resolve([
    {
      value: 1,
      label: 'lettuce',
    },
    {
      value: 2,
      label: 'tomato',
    },
  ]);
};

const units = [
  {
    label: 'Cup',
    value: 'cup',
  },
  {
    label: 'Pound',
    value: 'lb',
  },
  {
    label: 'Teaspoon',
    value: 'tsp',
  },
];

//used to generate options for ingredients
const ingredientOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(getIngredients(inputValue));
    }, 500);
  });

//styling
const builderPageStyle = theme => ({
  addIngredient: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addIngredientButton: {
    width: '15rem',
    margin: '1.25rem',
    height: '2.5rem',
  },
  ingredient: {
    padding: '0.25rem',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  adderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  container: {
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    zIndex: 3,
    marginTop: '2rem',
    padding: '0',
    minHeight: 600,
  },
  header: {
    backgroundColor: 'rgb(255, 198, 93)',
    textAlign: 'center',
    padding: '0.5rem',
  },
  content: {
    padding: '0.5rem',
  },
  tab: {
    padding: '0.5rem',
  },
  step: {
    padding: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

class BuilderPage extends Component {
  state = {
    name: '',
    ingredients: [],
    steps: [],
    tags: [],
    selectedIngredient: {},
    selectedUnit: '',
    selectedQuantity: 1,
    selectedStep: '',
    selectedTag: '',
    imageUrl: '',
    image: '',
  };

  //used in the image upload component
  setImageUrl = imageUrl => {
    this.setState({
      imageUrl: imageUrl,
    });
  };

  setImage = image => {
    this.setState({
      image: image,
    });
  };

  //event handlers
  handleIngredientChange = input => {
    this.setState({
      selectedIngredient: input,
    });
  };

  handleUnitChange = input => {
    this.setState({
      selectedUnit: input,
    });
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAddIngredient = () => {
    this.setState({
      ingredients: [
        ...this.state.ingredients,
        {
          ingredient: this.state.selectedIngredient,
          quantity: this.state.selectedQuantity,
          unit: this.state.selectedUnit,
        },
      ],
    });
  };

  handleAddStep = () => {
    this.setState({
      steps: [...this.state.steps, this.state.selectedStep],
      selectedStep: '',
    });
  };

  handlePost = () => {
    if (this.state.name !== '' && this.state.ingredients.length && this.state.steps.length) {
      let formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('ingredients', JSON.stringify(this.state.ingredients));
      formData.append('steps', JSON.stringify(this.state.steps)); //the formdata comma seperates so have to escape them
      formData.append('tags', JSON.stringify(this.state.tags));
      formData.append('image', this.state.image);
      fetch('/api/recipes', {
        method: 'post',
        body: formData,
      })
        .then(res => res.json())
        .then(body => console.log(body));
    } else {
      alert('Post incomplete');
    }
  };

  handleAddTag = () => {
    this.setState({
      tags: [...this.state.tags, this.state.selectedTag],
      selectedTag: '',
    });
  };

  //used to display the recipe in the preview
  getRecipe = () => {
    return {
      ingredients: this.state.ingredients,
      steps: this.state.steps,
      name: this.state.name,
      tags: this.state.tags,
      imageUrl: this.state.imageUrl,
    };
  };

  //remove handlers
  removeIngredient = targetIngredient => {
    this.setState({
      ingredients: this.state.ingredients.filter(ingredient => {
        return ingredient !== targetIngredient;
      }),
    });
  };

  removeStep = targetStep => {
    this.setState({
      steps: this.state.steps.filter(step => {
        return step !== targetStep;
      }),
    });
  };

  removeTag = targetTag => {
    this.setState({
      tags: this.state.tags.filter(tag => {
        return tag !== targetTag;
      }),
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container + ' container'} style={this.containerStyle}>
        <h1 className={classes.header}>Build A Recipe</h1>
        <div className={classes.content}>
          <Tabs defaultActiveKey="overview">
            <Tab eventKey="overview" title="Overview" className={classes.tab}>
              <div className="overview">
                <div id="preview">
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h2>Preview</h2>
                    <Button variant="contained" color="primary" onClick={this.handlePost}>
                      Post
                    </Button>
                  </span>
                  <RecipeCard recipe={this.getRecipe()} />
                </div>
                <div id="name">
                  <Typography>Name: </Typography>
                  <input name="name" type="text" style={{ width: '60%' }} onChange={this.handleInputChange} value={this.state.name} />
                </div>
                <div id="image">
                  <Typography>Image: </Typography>
                  <Upload setFileUrl={this.setImageUrl} setFile={this.setImage}></Upload>
                </div>
                <div id="tags">
                  <Typography>Tags: </Typography>
                  {this.state.tags.map((tag, index) => (
                    <span style={this.tagStyle} key={index}>
                      #{tag}
                      <IconButton aria-label="remove ingredient" onClick={() => this.removeTag(tag)}>
                        <CancelIcon />
                      </IconButton>
                    </span>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <input onChange={this.handleInputChange} name="selectedTag" style={{ width: '40%' }} value={this.state.selectedTag} />
                    <Button onClick={this.handleAddTag} style={{ height: '2.5rem' }} color="secondary" variant="contained">
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="ingredients" title="Ingredients" style={this.tabStyle}>
              {this.state.ingredients.map((ingredient, index) => (
                <div className={classes.ingredient} key={index}>
                  <span>
                    {ingredient.quantity} {ingredient.unit.label}
                    {ingredient.quantity > 1 && 's'} of {ingredient.ingredient.label}
                  </span>
                  <IconButton aria-label="remove ingredient" onClick={() => this.removeIngredient(ingredient)}>
                    <CancelIcon />
                  </IconButton>
                </div>
              ))}
              <div className={classes.adderContainer + ' adderContainer'}>
                <div style={{ width: '20%' }}>
                  <Typography>Quantity: </Typography>
                  <input type="number" onChange={this.handleInputChange} name="selectedQuantity" className="mr-sm-2 form-control" value={this.state.selectedQuantity} />
                </div>
                <div style={{ width: '25%' }}>
                  <Typography>Unit: </Typography>
                  <Select options={units} onChange={this.handleUnitChange} />
                </div>
                <div style={{ width: '50%' }}>
                  <Typography>Ingredient: </Typography>
                  <AsyncSelect name="ingredient-add" loadOptions={ingredientOptions} onChange={this.handleIngredientChange} className={classes.ingredientInput} />
                </div>
                <Button onClick={this.handleAddIngredient} color="secondary" variant="contained" className={classes.addIngredientButton}>
                  Add Ingredient
                </Button>
              </div>
            </Tab>
            <Tab eventKey="steps" title="Steps" className={classes.tab}>
              {this.state.steps.map((step, index) => (
                <div className={classes.step} key={index}>
                  <span>
                    {index + 1}. {step}
                  </span>
                  <IconButton aria-label="remove step" onClick={() => this.removeStep(step)}>
                    <CancelIcon />
                  </IconButton>
                </div>
              ))}
              <div className={classes.adderContainer + ' adderContainer'}>
                <textarea onChange={this.handleInputChange} name="selectedStep" style={{ width: '80%' }} value={this.state.selectedStep}></textarea>
                <Button onClick={this.handleAddStep} style={{ height: '2.5rem' }} color="secondary" variant="contained">
                  Add Step
                </Button>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withStyles(builderPageStyle)(BuilderPage);
