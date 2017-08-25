$(function () {
	
	var socket = io();
	
	$('#send_gists').on('submit', function (e) {
		e.preventDefault();
		var gist = $('#gist').val();
		socket.emit('createGist', {
			newGist: gist
		})
		$('gist').val('');
	})
	
		socket.on('newGist', function(data){
		function render(){
			 return (
				 '<div class="media"><div class="media-left"><a href="/user/'+data.user._id+'"><img class="media-object" src="'+ data.user.photo+'"alt="image"/></a></div><div class="media-body"><h4 class="media-heading">'+ data.user.name +'</h4><p>'+data.content.newGist+'</p></div></div>'
			)
		}
		$('.gists').prepend(render());
	});
})

