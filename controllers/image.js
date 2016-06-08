/* -------------------------------------------------
  OBJ:  The match controller of routes.js, for 
        var image = require('../controllers/image');
        app.post('/', image.index);
  CHG:  Use temporary data for sample 
  CHG: p. 241 Add Models with require to allow Models.Image.findOne
  CHG: p. 242 logic of findOne, p. 244 Logic of Create
       p. 249 like function
  OUTPUT:  p.202 Exec sidebar from helpers/sidebar.js assign the partials  
  --------------------------------------------------
*/

var fs = require('fs'),       // for rename / copy the image file
    path = require('path'),   // for create a path of the file destination
    sidebar = require('../helpers/sidebar'),   // only say it need the module
    Models = require('../models'),
    md5 = require('MD5');    
module.exports = {
    index: function(req, res) { // with parameter
        var viewModel = {
            image: {},
            comments: []
        };
        /* - filename is a field of document mapped in Image Mode
         - req.params.image_id is form the URL defined in routes file 
        */
        //--- Retrieve a Image model of Mongo (mapped with models/image.js)
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {   // image is a model of Mongo doc
                if (err) { throw err; }
                if (image) {
                    image.views = image.views + 1; // image views count
                    viewModel.image = image;       // the Mongo doc assign the Model
                    image.save();                         // save the image Model or doc in Mongo
                    /* Retrieve coments model of Mongo (mapped models/comment.js)
                     we want all comments where the image_id field of 
                     comments Model image_id field is equal to the
                      ._id property of the main image model of var viewModel
                    */
                    Models.Comment.find(
                        { image_id: image._id},
                        {},
                        { sort: { 'timestamp': 1 }},
                        function(err, comments){
                            viewModel.comments = comments;   // for var viewModel
                            sidebar(viewModel, function(viewModel) {
                                // to views/image.handlebars & partials/comments
                                res.render('image', viewModel);    // var viewModel
                            });
                        }
                    );
                } else {
                    res.redirect('/');
                }
            });
    },
    // only for POST in index.handlebars    
    create: function(req, res) {  
        var saveImage = function() {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
            // Provide a id of 6 possible chars to the file Name
            for(var i=0; i < 6; i+=1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            // search for filename = composite id imgUrl
            Models.Image.find({ filename: imgUrl }, function(err, images) {
                if (images.length > 0) {
                    saveImage();          // recursiva, por que obtuvo un id random que ya existe
                } else {                       // safe to rename the file and upload it to the serve
                    // Of configure.js, the tempPath = /public/upload/temp 
                    var tempPath = req.files.file.path,       // files for type="file" in <FORM>
                        ext = path.extname(req.files.file.name).toLowerCase(),
                        targetPath = path.resolve('./public/upload/' + imgUrl + ext);
                    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                        // move the file from  its temporary upload path to its final destination
                        fs.rename(tempPath, targetPath, function(err) {
                            if (err) { throw err; }
                            // create a new Image Model
                            var newImg = new Models.Image({
                                title: req.body.title,
                                filename: imgUrl + ext,
                                description: req.body.description
                            });
                            // execute fn save of the model
                            newImg.save(function(err, image) {
                                console.log('Successfully inserted image: ' + image.filename);
                                /* returns upd version of 
                                   itself is because MongoDB 
                                   will automatically include
                                   additional information 
                                    such as  _id and put in div 
                                    Newest Images
                                */
                                res.redirect('/images/' + image.uniqueId);
                            });
                        });   // end of rename
                    } else {
                        // delete the original file (from the temp folder it  was uploaded to)
                        fs.unlink(tempPath, function () {
                            if (err) throw err;
                            res.json(500, {error: 'Only image files are allowed.'});
                        });
                    }      // if ext png, jpg, etc.
                }    // if image
            });   // Models.Image.find
        };   // fn saveImage()
        saveImage();   // execute fn with the find & the save
    },
    // only for button in image.handlebars    
    like:  
        function(req, res) {
          // search by filename = req.params.image_id
          Models.Image.findOne({ filename: { $regex: req.params.image_id } },
              function(err, image) {
                  if (!err && image) {
                      image.likes = image.likes + 1;
                      image.save(function(err) {
                          if (err) {
                              res.json(err);
                          } else {
                              res.json({ likes: image.likes });
                          } // if err
                      }); // image.save
                  }   // if err & image
          }); // function & Models
    },
    // only for POST in image.handlebars
    comment: function(req, res) {  
        // search by filename = req.params.image_id
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {
                if (!err && image) {
                    // create a new comment of model with name, email & comment
                    var newComment = new Models.Comment(req.body);
                    // image gravatar based on email hash value
                    newComment.gravatar = md5(newComment.email);
                    newComment.image_id = image._id;  // key
                    newComment.save(function(err, comment) {
                        if (err) { throw err; }
                        res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                    });
                } else {
                    res.redirect('/');
                } // if err & Image
            }); // Models.Image.findOne
    }, // comment
    remove: function(req, res) {
      Models.Image.findOne({ filename: { $regex: req.params.image_id } },
        // el findOne le regresa un modelo image
        function(err, image) {
           if (err) { throw err; }
           // borra el filename asociado al modelo image
           fs.unlink(path.resolve('./public/upload/' + image.filename),
              function(err) {
                   if (err) { throw err; }
                   /* Next, find the comments associated 
                   with the image and remove those. Once
                   they have finished being removed, the
                   last step is to remove the image itself
                   */
                   Models.Comment.remove({ image_id: image._id},
                       function(err) {
                          // borra el modelo image
                          image.remove(function(err) {
                             if (!err) {
                                /* send a true Boolean
                                 JSON response back to 
                                 the browser
                                */
                                res.json(true);
                             } else {
                                res.json(false);
                             } // if !err
                          }); // image.remove
                   }); // Models.Comment.remove
              } // function(err)    
           ); // fs.unlink
        } // function(err. image) 
      );  // Models.Image.findOne
    } // remove
};

