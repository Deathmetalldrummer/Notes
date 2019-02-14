var de = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$de = $('.directory_edit');
		this.$edit = this.$de.find('.de__edit_');
		this.$check = this.$de.find('.de__check_');

		this.$textarea = $('.content__textarea');
		this.$content = $('.drawer__center');
	},
	events: function() {
		this.$edit.on('click',this.editFile.bind(this));
		this.$check.on('click',this.checkFile.bind(this));
	},
	editFile: function(e) {
		this.$textarea.val('edit!');
	},
	checkFile: function(e) {
		this.$content.html(this.$textarea.val());
		this.$textarea.val('');
	}
}
de.init();


// var _de = (function() {
// 	var $de = $('.directory_edit');
// 	var $edit = $de.find('.de__edit_');
// 	var $check = $de.find('.de__check_');
//
// 	function events() {
// 		$edit.on('click', editFile);
// 		$check.on('click', checkFile);
// 	}
// 	function editFile(e) {
// 		$('.content__textarea').val('edit!');
// 	};
// 	function checkFile(e) {
// 		$('.drawer__center').html($('.content__textarea').val());
// 		$('.content__textarea').val('');
// 	};
// 	return {
// 		init: events
// 	}
// }());
// _de.init();
