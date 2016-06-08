/* -----------------------------------------------------------------
   OBJ: lay a few random pieces of statistics about our app. Create a
       standard JavaScript object with a few properties for the various 
       stats, each set initially to  0
  CHG: 10 p. 261  Let’s update each function to properly
        query MongoDB and get some stats
   -----------------------------------------------------------------
*/
var models = require('../models'),
    async = require('async');
/*
module.exports = function() {
    var stats = {
        images:     500,
        comments:   400,
        views:      300,
        likes:      200
    };
    return stats;
};
*/
module.exports = function(callback) {
    async.parallel([
        function(next) { // total of Images
            /* use MongoDB’s count method to find the
             total number of documents in the images 
             collection matching any criteria
            */
            models.Image.count({}, next); // results[0]
        },
        function(next) { // total of Comments
            models.Comment.count({}, next);  // results[1]
        },
        function(next) {
            /* aggregate is a Mongo function
             resulting collection that is returned to the
             callback function is an array of documents 
             with the _id and viewsTotal fields
            */
            models.Image.aggregate({ $group : { //agg Mongo fn
                _id : '1',
                viewsTotal : { $sum : '$views' }
            }}, function(err, result) {
                var viewsTotal = 0;
                if (result.length > 0) {
                    viewsTotal += result[0].viewsTotal;
                }
                next(null, viewsTotal);
            });
        },
        function(next) {
            /*
             resulting collection that is returned to the
             callback function is an array of documents 
             with the _id and likesTotal fields
            */
            models.Image.aggregate({ $group : {
                _id : '1',
                likesTotal : { $sum : '$likes' }
            }}, function (err, result) {
                var likesTotal = 0;
                if (result.length > 0) {
                    likesTotal += result[0].likesTotal;
                }
                next(null, likesTotal);
            });
        }
    ], function(err, results){
        callback(null, {
            images: results[0],
            comments: results[1],
            views: results[2],
            likes: results[3]
        });
    });
};
