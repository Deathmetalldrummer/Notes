//#include("./_layout/_modal/_index.js");
var link = {
	modal__html: $('<input class="modal_href" type="text" placeholder="href"><br><input  class="modal_text" type="text" placeholder="text">'),
	submit: function() {
		var href = $('.modal_href').val();
		var text = $('.modal_text').val();
		this.html = $('<a href="' + href + '">' + text + '</a>');
		this.md = '';

		$('.wrapper__body').append(this.html);
	},
	close: function() {
		$('.modal_href').val('');
		$('.modal_text').val('');
	}
};
var h$ = {
	modal__html: $('<input class="modal_h_text" type="text" placeholder="text"><br><select class="modal_h"><option selected="selected" value="1">H1</option><option value="2">H2</option><option value="3">H3</option><option value="4">H4</option><option value="5">H5</option><option value="6">H6</option></select>'),
	submit: function() {
		var text = $('.modal_h_text').val();
		var h$ = $('.modal_h').val();
		var x = '';
		for (var i = 0; i < +h$; i++) {
			x+='#';
		}

		this.html = $('<h'+h$+'>'+text+'</h'+h$+'>');
		this.md = x+' '+text+'\n';
		$('.wrapper__body').append(this.html);
	},
	close: function() {
		$('.modal_h_text').val('');
		$('.modal_h').val('');
	},
};
$(function() {
	modal.init();
	$('.add__h').on('click', function() {
		modal.open(h$);
	});
	$('.add__link').on('click', function() {
		modal.open(link);
	});
});
