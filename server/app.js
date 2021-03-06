import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';

import indexRouter from './routes/index';
import pingRouter from './routes/ping';
import apiRouter from './routes/api';
import userRouter from './routes/user';
import recipeRouter from './routes/recipes';
import commentRouter from './routes/comments';

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

// Configure passport
require('./config/passport')(passport);

// Enable passport as the authentication middleware
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/ping', pingRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);
app.use('/recipe', recipeRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Show error in console
	console.log(err);

	// render the error page
	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = app;
