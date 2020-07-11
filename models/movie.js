const mongoose = require('mongoose');

const Movie = mongoose.model('Movies', new mongoose.Schema({
  title: String,
  genres: String,
  keywords: String,
  cast: String,
  director: String,
  tagline: String,
  release_date: String
}),'movies');

exports.Movie = Movie; 