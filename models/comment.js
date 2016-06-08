/*  The  image virtual property will be how we attach the
  related image when we retrieve comments later in our 
  controllers. For every comment, we are going to iterate
  through and look up its associated image and attach that
  image object as a property of the comment.
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  image_id:   { type: ObjectId }, // id of related image document from MongoDB
  email:      { type: String },
  name:       { type: String },
  gravatar:   { type: String },
  comment:    { type: String },
  timestamp:  { type: Date, 'default': Date.now }
});

// relationship between a comment and the image that it was posted to
CommentSchema.virtual('image')
    .set(function(image) {  // is the _id of the related image document from MongoDB
        this._image = image;
    })
    .get(function() {
        return this._image;
    });
// We are exporting the model Comment, not the schema
module.exports = mongoose.model('Comment', CommentSchema);
