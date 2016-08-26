var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('@ds015899.mlab.com:15899/lines');

/* Get Lines */
router.get('/', function(req, res, next) {
    var db = req.db;
    var posts = db.collection('posts');


    posts.find({}, {}, function(err, posts) {
    console.log(err, "<<<<<<<<<<<");
        res.render('index', {
            "posts": posts
        })
    })
});

module.exports = router;
