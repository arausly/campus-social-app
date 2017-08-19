const router = require('express').Router();
const User = require('../models/userModel');

router.get('/', (req, res) => {
	res.render('main/landing');
});

router.get('/create-new-user', (req, res, next) => {
	let user = new User({
		name: "Arausi",
		email: "arausid@yahoo.com",
		password: "@@&%",
	});
	user.save()
		.then((user) => {
             if(user){
				 res.json('Sucessfully created');
			 }
		}).catch(err =>next(err));
})

module.exports = router;
