const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../helpers/auth')

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');
//Ideas index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
        user: req.user.id
    })
    Idea.find({
        user: req.user.id
    }).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });

    });
});

// Add Idea form 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit Idea form 
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'No authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }

    });
});

//proccess form 
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'please add a title'
        })
    };
    if (!req.body.details) {
        errors.push({
            text: 'please add some details'
        })
    };
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser).save().then(idea => {
            req.flash('success_msg', 'Video Idea added');

            res.redirect('/ideas');
        })
    }

});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;


        idea.save().then(idea => {
            req.flash('success_msg', 'Video Idea updated');

            res.redirect('/ideas');
        });
    });
});

//Delete Idea 
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas')
    });
});
module.exports = router;