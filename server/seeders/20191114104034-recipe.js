"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test recipes
		const recipes = [
			{
				userId: 1,
				name: "Goulash",
				image: "https://www.spendwithpennies.com/wp-content/uploads/2018/09/Hungarian-Goulash-21-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Vegetable Pizza",
				image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2015/10/pizza-recipe-1-500x500.jpg",
				ingredients: ["cheese", "flour", "olives", "green pepper"],
				steps: ["bake pizza"],
				tags: ["pizza", "cheese"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Roasted Vegetables",
				image: "https://www.cookingclassy.com/wp-content/uploads/2018/12/roasted-vegetables-10-500x500.jpg",
				ingredients: ["broccoli", "zucchini", "tomatoes", "bell peppers"],
				steps: ["roast the veggies"],
				tags: ["vegetables", "roasted"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "California Rolls",
				image: "https://foodmeanderings.com/wp-content/uploads/2019/03/California-Rolls-Recipe-500x500.jpg",
				ingredients: ["rice", "fish", "black sesame"],
				steps: ["mix the ingredients"],
				tags: ["fish", "rice"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Fish Curry",
				image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2016/01/fish-curry-recipe-1-500x500.jpg",
				ingredients: ["fish", "curry"],
				steps: ["put the curry together"],
				tags: ["fish", "curry"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Fried Chicken",
				image: "https://thestayathomechef.com/wp-content/uploads/2016/06/Fried-Chicken-4-1-500x500.jpg",
				ingredients: ["chicken", "flour", "spices"],
				steps: ["fry the chicken"],
				tags: ["fried", "chicken"],
				createdAt: new Date(),
				updatedAt: new Date()
      },
      {
				userId: 1,
				name: "Garlic Butter Steak",
				image: "https://lifemadeketo.com/wp-content/uploads/2018/06/Best-Steak-recipe-photo-picture-1-7-500x500.jpg",
				ingredients: ["steak", "asparagus", "mushrooms", "garlic", "butter"],
				steps: ["sear and broil the steak"],
				tags: ["dinner", "steak", "asparagus", "red meat"],
				createdAt: new Date(),
				updatedAt: new Date()
			}
		];

		return queryInterface.bulkInsert("recipes", recipes, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("recipes", null, {});
	}
};
