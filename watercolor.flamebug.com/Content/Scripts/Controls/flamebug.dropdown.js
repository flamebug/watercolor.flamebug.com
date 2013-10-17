function registerDropDownScript() {

	$('.fb-dropdowntrigger').click(function() {
		var $dd = $(this).parent();

		if ($dd.hasClass('open'))
			$dd.removeClass('open');
		else
			$dd.addClass('open');

		$dd.children('.fb-dropdownpanel').toggle();
	});

	$(document).bind('click', function(e) {
		var $clicked = $(e.target);

		//
		//deactivate all dropdowns if the clicked
		//element is not a child of a dropdown
		//

		if (! $clicked.parents().hasClass('fb-dropdown'))
		{
			$('.fb-dropdown').removeClass('open');
			$('.fb-dropdownpanel').hide();
		}
	});

}