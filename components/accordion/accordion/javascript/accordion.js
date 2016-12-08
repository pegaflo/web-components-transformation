jQuery(function() {
	jQuery('.ss_button').on('click',function() {
		jQuery('.ss_content').slideUp('fast');
		jQuery(this).next('.ss_content').slideDown('fast');
	});
});