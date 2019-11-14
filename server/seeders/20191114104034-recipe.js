"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test recipes
		const recipes = [
			{
				userId: 1,
				name: "Best Goulash",
				image: "https://www.spendwithpennies.com/wp-content/uploads/2018/09/Hungarian-Goulash-21-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Best Goulash 2",
				image: "https://dinnerthendessert.com/wp-content/uploads/2019/01/Classic-Goulash-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Best Goulash 3",
				image: "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/goulash.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Best Goulash 4",
				image: "https://dinnerthendessert.com/wp-content/uploads/2019/08/Hungarian-Goulash-5-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Best Goulash 5",
				image: "https://laurenslatest.com/wp-content/uploads/2018/09/Goulash-Recipe-4-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				name: "Best Mac Goulash 6",
				image: "https://lilluna.com/wp-content/uploads/2018/05/goulash-final-resize-7-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
				createdAt: new Date(),
				updatedAt: new Date()
      },
      {
				userId: 1,
				name: "Best Vegan Goulash 7",
				image: "https://thevegan8.com/wp-content/uploads/2017/02/vegan-hungarian-goulash-500x500.jpg",
				ingredients: ["meat", "soup"],
				steps: ["boil stew"],
				tags: ["dinner", "stew"],
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
