$('#tabs_link').on('click',function(e) {
	var target = $(e.target);
	var contentHtml = $('#tabs_content').find('.tabs__html');
	var contentMd = $('#tabs_content').find('.tabs__md');
	if (target.hasClass('tabs__') && !target.hasClass('tabs_active')) {
		target.addClass('tabs_active').siblings('.tabs_active').removeClass('tabs_active');
		if (target.hasClass('tabs__html')) {
			contentHtml.addClass('tabs_active').siblings('.tabs_active').removeClass('tabs_active');
		}
		if (target.hasClass('tabs__md')) {
			contentMd.addClass('tabs_active').siblings('.tabs_active').removeClass('tabs_active');
		}
	}
})
