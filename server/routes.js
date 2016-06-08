/*  Pag. 143
  OBJ:  Is going to be a map of each of the available URL paths for the app. 
  NOTA: We’re calling them controllers because we’re using the MVC design pattern
       Controllers are really just modules with different functions defined that 
       match up to the corresponding routes. Typically, every route will
       correspond to a controller
  CHG: 10 p. 266 add delete
*/
var home = require('../controllers/home'),   // render the homepage of the site
    image = require('../controllers/image'); // render the page for a specific image

// --- Para que lo use configure.js
module.exports.initialize = function(app) {  // forma de designar nombre a una funcion
  // --- The 2nd parameter is a callback. The order is important    
    app.get('/', home.index);         // Express recover app'level vars 
    app.get('/images/:image_id', image.index); // you will see how to retrieve the value later
  // --- The post
    app.post('/images', image.create);  // when submits and uploads a new image
    app.post('/images/:image_id/like', image.like); // when clicks the Like button
    app.post('/images/:image_id/comment', image.comment); // when posts a comment
  // Route to erase one image
    app.delete('/images/:image_id', image.remove);
};
