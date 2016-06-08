/* -----------------------------------------------------------------
   OBJ: Returning various collections of images. Initially, we will 
      create a popular function that will be used to return a collection
      of the most popular images on the website. Initially, this collection 
      will simply be an array of image objects with the sample fixture data 
      present.
  CHG: 10 p.262 We just query MongoDB and find the top
    nine most liked images by sorting the images by total 
    like count in descending order and limiting the
    results to nine documents.
   -----------------------------------------------------------------
*/
var models = require('../models');
module.exports = {
    popular: function(callback) {
        models.Image.find({}, {}, { limit: 9, sort: { likes: -1 }},
            function(err, images) {
                if (err) throw err;
                callback(null, images);
            });
    }
};

/*
module.exports = {
    popular: function() {
        var images = [
           {
                uniqueId: 1,
                title:    'Sample Image 1',
                description:    '',
                filename: 'sample1.jpg',
                views:    5,
                likes:    50,
                timestamp:      Date.now
            }, {
                uniqueId: 2,
                title:    'Sample Image 2',
                description:    '',
                filename: 'sample2.jpg',
                views:    25,
                likes:    70,
                timestamp:      Date.now
            }, {
                uniqueId: 3,
                title:    'Sample Image 3',
                description:    '',
                filename: 'sample3.jpg',
                views:    60,
                likes:    30,
                timestamp:      Date.now
            }, {
                uniqueId: 4,
                title:    'Sample Image 4',
                description:    '',
                filename: 'sample4.jpg',
                views:    80,
                likes:    40,
                timestamp:      Date.now
            }
        ];
        return images;
    }
};
*/