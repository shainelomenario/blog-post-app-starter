var express = require('express');
const fs = require("fs");
var router = express.Router();
const postDBFileName = "./model/postDB.json";


router.get('/', function(req, res, next) {
  res.render('./auth/index');
});

router.get('/feed', function(req, res, next) {
  if(req.cookies.loggin === "false") res.redirect("/");
  let posts = readPostDB();
  res.render('./main/feed', {posts: posts.posts});
});

router.get('/compose', function(req, res) {
  if(req.cookies.loggin === "false") res.redirect("/");
  res.render('./main/compose');
});

router.post('/compose/submit', function(req, res) {
  if(req.cookies.loggin === "false") res.redirect("/");
  const {title, body} = req.body // Uses Express middleware to get the req object's data as a JSON

  // Invalid Input
  if (!title || !body) {
    return res.render('./main/compose', {
      error: 'Title and body are required',
      values: {title, body}
    });
  }

  let postDB = readPostDB();

  const newPost = {title, body};

  // Add new post to the beginning of the posts array DB
  postDB.posts.unshift(newPost);

  // Update the DB with the new post array
  fs.writeFileSync(postDBFileName, JSON.stringify(postDB, null, 4), 'utf-8');

  res.redirect('/feed');

});





function readPostDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
