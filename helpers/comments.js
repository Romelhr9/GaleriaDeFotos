/* -----------------------------------------------------------------
 OBJ: will return a collection of the newest comments posted to 
     the site The idea of particular interest is that each comment
     also has an image attached to it so that the actual image for each
     comment can be displayed as a thumbnail while displaying the list
     of comments (otherwise, we lose context when we see a random list
     of comments with no related image)
CHG: 10 p.255  every comment in the comments array will
   be passed individually to the  attachImage function. 
   When the entire collection has been iterated through,
   the final callback will execute, which basically fires 
   the very first  callback function that was passed into
   the  newest function as its only parameter
   -----------------------------------------------------------------
*/
var models = require('../models'),
    async = require('async');

module.exports = {
    newest: function(callback) {
        // retrieve array of * comments only latest 5
        models.Comment.find({}, {}, { limit: 5, sort: { 'timestamp': -1 } },
            function(err, comments){ // comments array
                // parm: model comment, next is chain link of async
                var fnAttachImage = function(comment, next) {
                    // retrieve image related to comment
                    models.Image.findOne({ _id : comment.image_id},
                        function(err, image) {
                            if (err) throw err;
                            comment.image = image;
                            next(err);
                        } // function
                    ); // models.Image.findOne
                }; // var attachImage
                /*
                   loop through every item in the 
                   collection in the first parameter, 
                   and send each item as a parameter 
                   to a callback function in the second
                   parameter. The third parameter is the
                   final callback function that is executed
                   once the entire series is finished with
                   the collection.                
                */
                // params: array comments, image related & fn inline
                async.each(comments, fnAttachImage,
                   /* fn inline will be executed once 
                   the lastitem in the comments collection has
                   been iterated on
                   */
                    function(err) {
                        if (err) throw err;
                        /*  callback is called with the
                         newly updated comments array 
                         It is passed the results of all 
                         of its work.                         
                        */
                        callback(err, comments);
                    } // function
                ); // async.each
            } // function 
        );  // models.Comment.find
    } // newest: function
}; // module