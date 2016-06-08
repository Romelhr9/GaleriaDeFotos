/*
OBJ: show sidebar of the page with comments, stats, popular images
CHG: 10 p.257  every comment in the comments array will
*/
var Stats = require('./stats'), 
    Images = require('./images'),  // retrieve collection of images
    Comments = require('./comments'), // retrieve latest comment
    async = require('async');
/*  param: callback is the result of the work that was
    performed within the function itself
*/
module.exports = function(viewModel, callback){
	/*  performing a series of unique functions all at
	   the same time  */
    async.parallel([
        function(next) {
        	// retrieve stats
            Stats(next);   //leave results in [0]
        },
        function(next) {
        	// retrieve images        	
            Images.popular(next);  //leave results in [1]
        },
        function(next) {
        	/*  Once that next callback function is 
        	called, it is passed the results of all 
        	of its work.
        	*/
        	// retrieve Comments
            Comments.newest(next);  //leave results in [2]
        }
    ], function(err, results) {
    	// Object viewModel with 3 properties 
        viewModel.sidebar = {
        	/* The index order is the order that the 
        	functions were defined in the original array
        	*/
            stats: results[0],
            popular: results[1],
            comments: results[2]
        };
        /* is an anonymous function that we will use
           to execute the rendering of the HTML page.
        */
        callback(viewModel);  // execute  the callback index or image.handlebar
    });
};
