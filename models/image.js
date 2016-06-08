/* OBJ: All document operations from the db is handled 
     by models.  View http://mongoosejs.com/docs/models.html
   SALIDA: Usada en views/index.handlebars,  views/image.handlebars,
        views/partials/popular.handebars y comments.handlebars
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var ImageSchema = new Schema({
    title:          { type: String },
    description:    { type: String },
    filename:       { type: String },   //used in controllers/image.js
    views:          { type: Number, 'default': 0 },
    likes:          { type: Number, 'default': 0 },
    timestamp:      { type: Date, 'default': Date.now }
});
/*  We created a virtual property of  uniqueid , which is
    just the filename with the file extension removed
*/
ImageSchema.virtual('uniqueId')   // used in views/index.handlebars
    .get(function() {
        return this.filename.replace(path.extname(this.filename), '');
});
// We are exporting the model Image, not the schema
module.exports = mongoose.model('Image', ImageSchema);
