var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Register Page
router.get('/register', function(req, res) {
	res.render('register');
});

// Login Page
router.get('/login', function(req, res) {
	res.render('login');
});


// Login User
router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('login', {
			errors:errors
		});
	} else {
		res.redirect('/dashboard')
	}
});


// Register User
router.post('/register', function(req, res){
	var username = req.body.username;
	var email = req.body.email;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var password = req.body.password;
	var password2 = req.body.confirm_password;

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('first_name', "First Name is required").notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('password', 'Password is a required field').notEmpty();
	req.checkBody('password', "Passwords do not match").equals(password2);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors:errors
		});
	} else {
		var newUser = new User({
			username: username,
			password: password,
			email: email,
			first_name: first_name,
			last_name: last_name
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/users/login');
	}
});

module.exports = router;