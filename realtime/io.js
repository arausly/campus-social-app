const async = require('async');
const Gist = require('../models/gist');
const User = require('../models/userModel');

module.exports = function(io){
	io.on('connection',(socket)=>{
		console.log('user connected');  
		let user =  socket.request.user;
	   socket.on('createGist',(content)=>{
	      async.parallel([
			  function(callback){
			   io.emit('newGist',{ content, user })	  
			  },
			  function(callback){
				  async.waterfall([
					  function(callback){
						 let newGist = Gist();
						  newGist.content = content.newGist;
						  newGist.author = user._id;
						  newGist.save(function(err){
							  callback(err,newGist);
						  })
					  },
					  function(newGist,callback){
						  User.findOneAndUpdate({
							  _id:user._id
						  },{
							 $push:{gists:{gist:newGist._id}}
						  },function(err,user){
							  callback(err,user)
						  })
					  }
				  ])
			  }
		  ])
	   })
	})
}