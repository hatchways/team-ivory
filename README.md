# EXPRESS-STARTER


## Setting Up the Database

Make sure Postgres is installed on your computer.

Enter into Postgres Client by typing `psql` into your terminal.

In postgres, type in the following queries:
> create user ivory with password 'hatchways';

> create dabatase recipe_dev with owner ivory;

Exit psql with `\q`

If you have all the dependencies installed, run the following:
> npx sequelize db:migrate

> npx sequelize db:seed:all

You can undo the previous migration and seeds with:
> npx sequelize db:migrate:undo:all

> npx sequelize db:seed:undo:all

Once you have your database set up, restart your server and see if the client fetches the test user and displays it on the home page!