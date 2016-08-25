var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/create', function(req, res, next){
    var categories = db.get('categories');

    categories.find({}, {}, function(err, categories){
        res.render('create', {
            "title": 'New Line',
            "categories": categories
        })
    })
});

router.post('/create', function(req, res, next) {
    // get new line values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var date = new Date();

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    var errors = req.validationErrors();
        if(errors) {
            res.render('create', {
                "errors": errors,
                "title": title,
                "category": category,
                "body": body
            });
        } else {
            var posts = db.get('posts');

            posts.insert({
                "title": title,
                "body": body,
                "category": category,
                "date": date
            }, function(err, post) {
                if(err) {
                    res.send('There have been validation errors: ' + util.inspect(errors), 400);
                    return;
                } else {
                    req.flash('success', 'New Line submitted');
                    res.location('/');
                    res.redirect('/');
                }
            })
        }
});

module.exports = router;
