const router = require('express').Router();
const User = require('../models/userModel');
const passport = require('passport');
const passportConfig = require('../config/passport');


router.route('/signup')
	.get((req, res, next) => {
		res.render('accounts/signup', {
			message: req.flash('errors')
		})
	})
	.post((req, res, next) => {
		User.findOne({
			email: req.body.email
		}).then(existingUser => {
			if (!existingUser) {
				let newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				})
				newUser.photo = newUser.createPhoto();
				newUser.save().then(user => {
					res.redirect('/');
				}).catch(err => next(err))
			} else {
				req.flash('errors', 'Account with email already exist');
				res.redirect('/signup')
			}
		}).catch(err => next(err))
	})

router.route('/login')
 .get((req,res,next)=>{
	if(req.user) return res.redirect('/');
	res.render('accounts/login',{message:req.flash('loginMessage')})
})
.post(passport.authenticate('local-login',{
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash:true
}))

module.exports = router;
