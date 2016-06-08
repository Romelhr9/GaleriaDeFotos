/* -------------------------------------------------
  TIT:  controllers/home.js
  OBJ:  The match controller of routes.js, for 
        var home = require('../controllers/home');
        app.get('/', home.index);
  CHG:  Use sample data, the viewModel variable is an object that contains a 
        single property called images, which is itself an array. The most 
        obvious properties we came up with while deciding what kind of information
        we want per image.  
        In index.handlebars view, we had a {{#each images}} loop that iterated through 
        each image in the images collection of the view model passed to  the template
  CHG: Execute sidebar   
  CHG: p.238 Populating viewModel from array of docs to Mongo DB
  --------------------------------------------------
*/
var sidebar = require('../helpers/sidebar'),    // only say it need the module
    ImageModel = require('../models').Image;

module.exports = {
    index: function(req, res) {
        var viewModel = {
            images: {}    // used in index.handlebars as {{#each images}}
        };
        //--- Retrieve all docs
        ImageModel.find({}, {}, { sort: { timestamp: -1 }},   // -1 indica ascending
            function(err, images) {
                if (err) { throw err; }
                viewModel.images = images;
                // Call the sidebar wait to render until the sidebar completed populating viewModel .          
                sidebar(viewModel, function(viewModel) {
                    res.render('index', viewModel);   // the views/index.handlebars with data
                });
            });
    }
};
