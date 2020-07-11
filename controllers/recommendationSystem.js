const neatCsv = require('neat-csv');
//const mongoose = require('mongoose');
const { spawn } = require('child_process');
const { Movie } = require('../models/movie');

exports.getItems = async (req, res, next) => {
    try {
        const page = req.query.pageNum || 0;
        const movies = await Movie.find().skip(page * 10).limit(10).sort('title');
        res.status(200).json({
            success: true,
            movies: movies
        });
    } catch (error) {
        console.log(`Error on getting items: ${error.message}`.red);
        res.status(500).json({
            success: false,
            errors: ["Unable to get items", error.message],
        });
    }
};

exports.postRecommendations = async (req, res, next) => {
    try {
        var result = require('child_process').execSync(`python3 ${__dirname}/engine.py`).toString();
        recommended_movies = result.split(",")
        console.log(recommended_movies)
        const movies = await Movie.find({ title: { $in: recommended_movies } });
        res.status(200).json({
            success: true,
            movies: movies
        });
    } catch (error) {
        console.log(`Error on generating recommendations ${error.message}`.red);
        res.status(500).json({
            success: false,
            errors: ["Unable to generate recommendation", error.message],
        });
    }
};