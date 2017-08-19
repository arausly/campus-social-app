const router = require('express').Router();
const User = require('../models/userModel');

router.route('/signup')
	.get((req, res, next) => {
		res.render('accounts/signup', {
			message: req.flash('errors')
		})
	})
	.post((req, res, next) => {
		User.findOne({
			email: req.body.email,
		}).then(existingUser => {
			if (!existingUser) {
				let newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					photo: this.createPhoto()
				})
				newUser.save().then((user) => {
					res.redirect('/')
				}).catch(err => err);
			}
			req.flash('errors', 'Email already exists');
			res.redirect('/signup');
		})
	})

module.exports = router;
