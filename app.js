const express         = require('express');
const passport        = require('passport');
const LocalStrategy   = require('passport-local');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const mongoose        = require('mongoose');
const expressSanitizer = require('express-sanitizer');
const user            = require('../YelpCamp/models/user');
////////////////
///APP CONFIG///
////////////////

app = express(); 
//going to add a proper database soon
mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

////////////////////////////
//////Passport Config //////
////////////////////////////

///////////////////////////
//MONGOOSE MODEL CONFIG ///
///////////////////////////

///////////////////
///Blog Schema/////
///////////////////
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);

//User Schema
// const userSchema = new mongoose.Schema({
//     name: String, 
//     password: String
// });

///////////////////
// RESTFUL ROUTES//
///////////////////

//Landing Pageno
app.get('/', (req,res) => {
    res.render('landing');
});

//INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log('Error');
        } else {
           res.render('index', {blogs: blogs}); 
        }
    });

});

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
//CREATE ROUTE
app.post('/blogs', (req, res) => {
    //create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log('=============================');
    console.log(req.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('new');
        } else {
            //then, redirect to index
            res.redirect('/blogs');
        }
    });
});

//SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

//DELETE ROUTE 
app.delete('/blogs/:id', (req, res) => {
    //destory blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.listen(8000, () => { 
    console.log('Blog Server is running'); 
});