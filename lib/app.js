'use strict';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movies = require("./routes/movies");
var users = require("./routes/users");
var comment = require("./routes/comment");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//router for movies
//{"name":"Dangal", "movietype": "Sports", "Directedby":"Nitesh Tiwari","mainActor":"Aamir Khan"}
app.put('/movies/:id', movies.upvote);
app.put('/movie/change/:id', movies.changeMovieInfo);
app.get('/movies', movies.rankformovies);
app.get('/movie/:id', movies.getOneMovie);

app.delete('/movies/:id', movies.removeMovie);
app.post('/movies', movies.addMovie);
app.post('/addmoviestest', movies.addMovietest);
app.get('/movies/:movietype', movies.getMoviesByType);
app.get('/movies/actor/:mainActor', movies.getMoviesByActor); //fuzzy?
app.get('/movies/director/:Directedby', movies.getMoviesByDirector); // params or query?
//app.get('/movies/comments/:name',movies.getMovieComments)
//router for users
app.get('/usr/myself', users.getMy);
app.get('/usr', users.getusers);
app.get('/usr/upvote/:upvotefor', users.getUserWithUpvotefor);
app.get('/usr/comment/:commentfor', users.getUserWithCommentfor);
app.post('/usr', users.addUser);
app.put('/usr/pw', users.changepw);
app.delete('/usr/:id', users.removeOneUser);
app.put('/usr/vote', users.addUpvote);
//router for comments
app.get('/comment/one/:id', comment.getOneComment);
app.get('/comment', comment.getcomments);
app.get('/comment/movie/:commentfor', comment.getCommentByMovieName);
app.get('/comment/:username', comment.getUserComment);
app.put('/comment/:id', comment.editComment);
app.delete('/comment/:id', comment.removeComment);
app.post('/comment', comment.addcomment);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;