const sort = (recipes, sortBy, direction) => {
	console.log('sortBy', sortBy);
	console.log('direction', direction);
	return recipes.sort((a, b) => {
		if (sortBy === 'name') {
			if (direction === 'desc') {
				return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? 1 : -1;
			}
			return a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;
		}
		if (direction === 'desc') {
			return a[sortBy] < b[sortBy] ? 1 : -1;
		}
		return a[sortBy] > b[sortBy] ? 1 : -1;
	});
};

module.exports = { sort };
