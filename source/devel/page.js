//#include("./_layout/_modal/_index.js");

var link = {
	html: $('<input class="modal_href" type="text" placeholder="href"><br><input  class="modal_text" type="text" placeholder="text">'),
	submit: function() {
		var href = $('.modal_href').val();
		var text = $('.modal_text').val();
		$('.wrapper').append($('<a href="'+href+'">'+text+'</a>'));
	},
	close: function() {
		$('.modal_href').val('');
		$('.modal_text').val('');
	}
}

$(function() {
	modal.init();
	$('.add').on('click',function() {
		modal.open(link);
	})
});
