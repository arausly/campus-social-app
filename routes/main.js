const router = require('express').Router();
const async = require('async');
const User = require('../models/userModel');
const Gist = require('../models/gist');

router.get('/', (req, res, next) => {
	if (req.user) {
		Gist.find({})
			.sort('-created')
			.populate('author')
			.exec()
			.then(gists => {
				if (!gists) return Promise.reject();
				res.render('main/home', {
					gists
				});
			}).catch(err => next(err));
	} else {
		res.render('main/landing');
	}
});

router.get('/user/:id', (req, res, next) => {
	async.waterfall([
		function (callback){
			Gist.find({
					author:req.params.id
				})
			    .sort('-created')
				.populate('author')
				.exec(function (err, gists){
					callback(err, gists);
					console.log(gists)
				})
		
		},
		function (gists, callback) {
			User.findOne({
					_id: req.params.id
				})
				.populate('following')
				.populate('followers')
				.exec(function(err,identifiedUser){
				   res.render('main/user',{identifiedUser,gists})
				   callback(err,identifiedUser);
			})
		}
	])
})

module.exports = router;
