var de = {
	init: function() {
		this.cacheDom();
		this.events();
	},
	cacheDom: function() {
		this.$de = $('.directory_edit');
		this.$edit = this.$de.find('.de__edit_');
		this.$check = this.$de.find('.de__check_');

		this.$textarea_html = $('#tabs_content').find('.tabs__html textarea');
		this.$textarea_md = $('#tabs_content').find('.tabs__md textarea');
		this.$content = $('.drawer__center');
	},
	events: function() {
		this.$edit.on('click',this.editFile.bind(this));
		this.$check.on('click',this.checkFile.bind(this));
	},
	editFile: function(e) {
		var file = arch.find(menu.focus());
		if (file && file.type === 'file') {
			this.$textarea_html.val(cryptoOut(file.content.html));
			this.$textarea_md.val(cryptoOut(file.content.md));
			arch._set_local();
		}
	},
	checkFile: function(e) {
		var file = arch.find(menu.focus());
		if (file && file.type === 'file') {
			var toContentHtml = this.$textarea_html.val();
			var toContentMd = this.$textarea_md.val();
			file.content.html = cryptoIn(toContentHtml);
			file.content.md = cryptoIn(toContentMd);
			this.$textarea_html.val('');
			this.$textarea_md.val('');
			menu._show_content();
			arch._set_local();
		}
	}
}



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
