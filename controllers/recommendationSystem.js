const neatCsv = require('neat-csv');
//const mongoose = require('mongoose');
const { spawn } = require('child_process');
const { Movie } = require('../models/movie');

exports.getItems = async (req, res, next) => {
    try {
        const page = req.query.pageNum || 0;
        if(req.query.search != ''){
            searchKey = req.query.search;
            var searchKey = new RegExp(req.query.search, "gi");
            const movies = await Movie.find({title:searchKey}).skip(page * 10).limit(10).sort('title');
            res.status(200).json({
                success: true,
                movies: movies
            });
        }
        else{
            const movies = await Movie.find().skip(page * 10).limit(10).sort('title');
            res.status(200).json({
                success: true,
                movies: movies
            });
        }
        
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
        const { favorites } = req.body
        if (favorites.length > 0) {
            var result = require('child_process').execSync(`python3 ${__dirname}/engine.py "${favorites.join("|")}"`).toString();
            console.log(result)
            recommended_movies = result.replace("\n", "").split("|")
            console.log(recommended_movies)
            const movies = await Movie.find({ title: { $in: recommended_movies } });
            res.status(200).json({
                success: true,
                movies: movies
            });
        } else {
            res.status(200).json({
                success: false,
            });
        }
    } catch (error) {
        console.log(`Error on generating recommendations ${error.message}`.red);
        res.status(500).json({
            success: false,
            errors: ["Unable to generate recommendation", error.message],
        });
    }
};