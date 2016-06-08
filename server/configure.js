/*  Pag. 135
  OBJ: We will defer to a custom module that we’ll create called configure.
  RUN:  Puede ejecutar asi $ PORT=5500 node server.js
*/
var connect = require('connect'), // of Express, view app.use in this file
    path = require('path'),
    routes = require('./routes'),
    exphbs = require('express3-handlebars');  // dynamic HTML, ex: Hello {{ name }}!
    moment = require('moment');
/* the actual module that will be exported, a function that accepts our app object
   as a parameter as well as returns that same object (after we make some configuration)
*/
module.exports = function(app) {   
// our server knows any time try to render an HTML page with extension .handlebars
    app.engine('handlebars', exphbs.create({  // params: file extension, create to build the engine
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',   // views defined in server.js
        partialsDir: [app.get('views') + '/partials'], // an array, if there more subdirectories
        helpers: {
            timeago: function(timestamp) {
                console.log(timestamp);
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine); // 
    app.set('view engine', 'handlebars');  // Handlebars as the default view rendering engine
    // Executing our Express app’s .use(), which is how we indicate each middleware that we want to use
    app.use(connect.logger('dev'));  //  performs a console.log() of any request that is received by the server.
    app.use(connect.bodyParser({     // facilitate the packing of any form submitted via an HTML form submissio
        uploadDir:path.join(__dirname, '../public/upload/temp')
    }));
    app.use(connect.json());  // specifically for posted JSON data
    app.use(connect.urlencoded());  // specifically fields via a GET
    app.use(connect.methodOverride()); // older browsers that don’t properly support REST HTTP verbs such as  UPDATE and  PUT 
    app.use(connect.cookieParser('some-secret-value-here')); // allows cookies to be sent/received
    app.use(app.router);
    //  render static content files to the browser from a predefined static resource directory
    app.use('/public/', connect.static(path.join(__dirname, '../public')));

    if ('development' === app.get('env')) {
        app.use(connect.errorHandler());   // handles any errors that occur throughout the entire middleware process. a default 404 HTML page, or log the error to a data store
    }
    routes.initialize(app); // execute initialize() defined in exports of routes

    return app;
};
