/*  
 * --------------------------------
  OBJ: p. 131, In our case, this is the file that will create the HTTP 
       server and listen for all HTTP events, which is ultimately 
       the point of our entire application.
  CHG:  Chapter 4, p.123
       - Crear server.js, este archivo, para activar el servidor de localhost
  CHG: Chapter 4, p.144
       - Inicia con llamar a configure.js
  CHG:  Chapter 4, p. 151
       - Crea routes.js
       - Inicia con llamar a configure.js que llama a routes.js
       - Y este deja el camino para que el server se enrrute a una u otra pagina
       - Desde configure.js llama a routes.js
       - Actualizar a Express 4.0.0
       - routes establece los get hacia controllers y las funciones en linea de ellos
       - Agregar que muestre letreros de conexion mediante controladores        
  CHG:  05 Chapter 5, p.158 crear
       - views/index.handlebars (de routes.js): upload file image
       - views/image: display a specific image object, properties title, etc.
       - layout/main: indica el {{body}} y cuales partials\file colocara, asi como el footer.
                      El body sera reemplazado por views\index e image dichos en routes.js
                      y en configure.js con defaultLayout, partialsDir y layoutDirs
       - partials/stats, popular & comments.handlebars
       - la fn timeago definida como helpers en configure.js, es usada aqui y alla
       - Use viewModels in controller home.js
  CHG: 06 Chapter 6, p.184
       - Return to express 3.0 in routes.js of folder 03-App-route-ctls-simples
       - Return to express 3.0 in configure.js of folder 03-App-route-ctls-simples
       - The controllers/image.js to handle uploading and saving of the image files 
         via the form on the homepage
      - Create folder public/upload/temp
  CHG: 07 p. 201 creating few modules for the sidebar
      - Create helpers/sidebar.js   p.203
      - Add call of sidebars in controllers/home.js & images.js
      - Add helpers/stats, comments, images.js p. 202
      - Create public/js/script.js   p.211-212
      - Update like function in controllers/image.js
      - test functionlaty with the end of page 212
  CHG: 08 p. 231 use mongoose
  CHG: 10 p. 254 . TAsync function allows us to execute
      asynchronous functions sequentially, each waiting until the previous function finishes
      before  executing a single callback function at the end. The  parallel function allows us to
      do the opposite—execute a number of asynchronous functions simultaneously, waiting
      until they all complete before executing a single callback function when the last function
      is finished. How does a single callback function handle the responses of a number of
      different asynchronous functions, you ask? By accepting an array of the responses of each
      function as a parameter!
  CHG 11 p.265 Update  routes.js to include a new route to handle  Delete requests
      Update  controllers/image.js to include a new function for the route
     This should not only remove the image from the database, but also delete the file and
     all related comments
     Update the  image.handlebars HTML template to include a Remove button
     Update the  public/js/scripts.js file with an AJAX handler for the Remove
     button
  RUN:  Puede ejecutar asi $ PORT=5500 node server.js      
  -------------------------------- 
*/
var express = require('express'), 
    config = require('./server/configure'), // de configure.js
    app = express(),     // This  app  object powers our entire app
    mongoose = require('mongoose'); //  for persistent data

//--- Express define app'level constants maybe from environment var
app.set('port', process.env.PORT || 3300);  // process.env.PORT  environment
app.set('views', __dirname + '/views');
app = config(app);    // invoca funcion anonima que esta en module.exports

//--- maintain open connection to db server for app lifetime
mongoose.connect('mongodb://localhost/imgPloadr');
mongoose.connection.on('open', function() { // listener to fire when db server has connected
   console.log('Mongoose connected.');
});

//--- crea un http server y se le pone a escuchar
var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});
