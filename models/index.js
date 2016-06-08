/* OBJ:  acts as an index file for the modules within
it. This is by convention, so you don’t have to adhere
to this if you don’t want to. Since our  models folder 
will contain a number of different files, each a unique
module for one of our models, it would be nice if we could
just include all of our models in a single require statement.
Using the  index.js file we can do so pretty easily too

The  index.js file inside the  models directory simply 
defines a JavaScript object that consists of a name-value 
pair for each module in our directory. We manually maintain
this object, but this is the simplest implementation of the concep

Now, thanks to this basic file, we can perform  require('./models') 
anywhere in our application and know that we have a dictionary of 
each of our models via that module.
*/
module.exports = {
    'Image': require('./image'),        // recibe el modelo Image
    'Comment': require('./comment')
};
