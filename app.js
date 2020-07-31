//jshint esversion:6

const express = require("express"); // require Express
const bodyParser = require("body-parser"); // require body-parser
const mongoose = require("mongoose"); // require mongoose
const ejs = require("ejs"); // require ejs
const _ = require("lodash"); // require lodash

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); // initialize our app

app.set('view engine', 'ejs'); // set our EJS engine

app.use(bodyParser.urlencoded({extended: true})); // set the view engine for the EJS templates
app.use(express.static("public")); // // tells the server that our static files to be served to client are in the file named public

mongoose.connect("mongodb+srv://admin-emmanuel:home123@cluster0.tngp1.mongodb.net/blogDB",{useNewUrlParser:true}); // create a MongoDB database and establishes a connection

const postsSchema = { // schema for the posts
  title:String,
  content:String
};

const Post = mongoose.model("Post",postsSchema); // create a collection of "posts" for our posts


app.get("/", function(req, res){ // home route

  Post.find({},function(err,foundPosts){ // look for all posts in our Post collection

    res.render("home", { // render the home page using the array of foundPosts
      startingContent: homeStartingContent,
      posts: foundPosts
      });


  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent}); // renders the about page
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent}); // renders the contact me page
});

app.get("/compose", function(req, res){
  res.render("compose"); // renders the compose page
});

app.post("/compose", function(req, res){
  const post = new Post ({ // create a new Post document
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save( function(err){ // save the document
    if(!err){ // check if there is any error
      console.log("Post inserted!");
      res.redirect("/"); // redirect to the home route
    }
  });

});

app.get("/posts/:postID", function(req, res){

  const postID = req.params.postID; // tap into the route paramter

  Post.findOne({_id:postID}, function(err,foundPost){ // finds the document in the posts collections with the particular id specified

    if(!err){
      res.render("post",{title:foundPost.title , content:foundPost.content}); // renders the page for the indivudal post
    }
  });

});

let port = process.env.PORT; // let port be the port Heroku has set up
if (port == null || port == "") { // if it is not set up or port is an empty string
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started sucessfully");
});
