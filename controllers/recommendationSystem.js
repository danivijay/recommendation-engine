const neatCsv = require('neat-csv');

exports.getItems = async (req, res, next) => {
    console.log('here')
    try {
        const filePath = path.join(__dirname, 'recommendation_engine/movie_dataset.csv');
        fs.readFile(filePath, (error, data) => {
        if (error) {
            return console.log('error reading file');
        }
        neatCsv(data)
            .then((parsedData) => console.log(parsedData));
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
        
    } catch (error) {
        console.log(`Error on generating recommendations ${error.message}`.red);
        res.status(500).json({
            success: false,
            errors: ["Unable to generate recommendation", error.message],
        });
    }
};