const mongoose = require('mongoose');
const {Schema} = mongoose;


const gistSchema = new Schema({
	author:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	content:String,
	created:{
		type:Date,
		default:Date.now
	}
})


module.exports = mongoose.model('gist',gistSchema);