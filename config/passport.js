const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');


//persist userId to session obj
passport.serializeUser(function (user, done) {
	done(null, user.id);
})

//retrieve userId to session obj
passport.deserializeUser(function (id, done) {
	User.findById(id)
		.then(user => {
			done(null, user);
		}).catch(err => done(err, null))
})

//login config
//passReqToCallback is used to pass the request,
//object to the localStrategy callback.

passport.use('local-login', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		User.findOne({
				email
			})
			.then(user => {
				if (!user) return done(err, false, req.flash('loginMessage', 'User not found'));
				if (!user.verifyPassword(password)) return req.flash('loginMessage', 'wrong password');
				done(null, user);
			}).catch(err => done(err))
	}))
