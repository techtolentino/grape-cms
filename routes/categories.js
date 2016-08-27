var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* Get Categories */
router.get('/add-category', function(req, res, next) {
    res.render('add-category', {
        "title": "Add Category"
    })
});

router.post('/add-category', function(req, res, next) {
    // get new line values
    var title = req.body.title;

    req.checkBody('title', 'Title is required').notEmpty();

    var errors = req.validationErrors();
        if(errors) {
            res.render('add-category', {
                "errors": errors,
                "title": title
            });
        } else {
            var categories = db.get('categories');

            categories.insert({
                "title": title
            }, function(err, post) {
                if(err) {
                    res.send('There have been validation errors: ' + util.inspect(errors), 400);
                    return;
                } else {
                    req.flash('success', 'New category submitted');
                    res.location('/');
                    res.redirect('/');
                }
            })
        }
});

module.exports = router;
