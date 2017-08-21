const mongoose = require('mongoose');
const {
	Schema
} = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const async  =  require('async');
const userSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
	},
	password: String,
	photo: String,
	tweets: [{
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "Tweet"
		}
	}]
});


userSchema.pre('save', function (next) {
	let user = this;
	if (user.isModified('password')) {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) => {
					user.password = hash;
					next();
				});
			});
	} else {
		next();
	}
})

//size may be passed or not default size is 80px,
//md5 is a hash funtion that returns 128 bit long hash unlike the sha256 which is 256bit long
//the crypto.create returns a hash object using the encoding data format provided i.e md5
//the update simply updates the hash objects with the user email.
//the digest method returns a hexadecimal string of the hash object.
//could also be latin1 as an alternative to hex

userSchema.methods.createPhoto =function (size) {
	if (!size) return size = 200;
	if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
	let md5 = crypto.create('md5').update(this.email).digest('hex');
	return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

// instance custom method 
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password,this.password);
}


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
