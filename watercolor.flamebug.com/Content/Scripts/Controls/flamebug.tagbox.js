//
// Flamebug.Tagbox
//

(function ($) {

	//
	// flamebug Namespace
	// 

	if (!$.flamebug) {

		$.flamebug = new Object();

	};

	//
	// flamebug.Tagbox Plugin
	// 

	$.flamebug.Tagbox = function (el, options) {

		var base = this; 						// use base to avoid scope issues (instead of 'this')
		base.$el = $(el); 						// jQuery version of the element
		base.el = el; 							// DOM version of the element
		base.$el.data("flamebug.Tagbox", base); 				// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function () {

			base.setupOptions();
			base.cacheElements();

			base.wrapInput();

			base.arrayTags = [""];
			base.index = 0;
			base.inputWidth = 64;

			base.populateTags();
			base.attachEvents();

			base.$hidden.hide();
			//base.$input.focus().val("");

		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function () {

			base.options = $.extend({}, $.flamebug.Tagbox.defaults, options);

		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function () {

			base.$hidden = base.$el;

		};

		//
		// wrapInput: Wrap the input field and add the tag list
		//

		base.wrapInput = function () {

			base.$hidden.wrap('<div class="' + base.options.containerClass + '" style="' + base.$hidden.attr("style") + '" />');
			base.$container = base.$hidden.parent();
			base.$tags = $('<ul/>').appendTo(base.$container);
			base.$inputWrapper = $('<li class="' + base.options.inputClass + '" />').appendTo(base.$tags);
			base.$input = $('<input type="text"/>').appendTo(base.$inputWrapper);

		};

		//
		// populateTags: Populate tags that are pre-populated in the input field value at load
		//

		base.populateTags = function () {

			var arr = base.$hidden.val().split(",");

			for (var i = 0; i < arr.length; i++) {
				base.insertTag(arr[i]);
			}

		};

		//
		// attachEvents: Attach the click event to the disclosure
		//

		base.attachEvents = function () {

			base.$input.keypress(base.keypress);

			base.$input.keydown(base.keydown);

			base.$container.click(function () {

				base.$input.focus();

			});

		};

		//
		// insertTag: Insert a tag
		//

		base.insertTag = function (tag) {

			if (jQuery.inArray(tag, base.arrayTags) == -1) {
				var $newTag = $('<li class="' + base.options.tagClass + '"><span>' + tag + '</span><a></a></li>').insertBefore(base.$inputWrapper);

				$newTag.find("a").click(base.deleteClick);

				// insert new tag to js array
				base.arrayTags[base.index] = tag;
				base.index++;

				base.$hidden.val(base.arrayTags.join(","));
			}

		};

		//
		// removeTag: Remove a tag
		//

		base.removeTag = function (tag) {

			for (var i = 0; i < base.arrayTags.length; i++) {
				if (base.arrayTags[i] == tag) {
					base.arrayTags.splice(i, 1);
					break;
				}
			}

			base.index--;

			base.$hidden.val(base.arrayTags.join(","));

		};

		//
		// keypress: Evaluate the keypress event
		//

		base.keypress = function (event) {

			var text = jQuery.trim($(this).val()).replace(',', '').toLowerCase();

			switch (event.which) {
				case 13:
				case 44:
					if (text != '')
						base.insertTag(text);

					base.clearInput();

					return false;

				default:
					base.resizeInput();
					break;
			}

		};

		//
		// keydown: Evaluate the keydown event
		//

		base.keydown = function (event) {

			var text = jQuery.trim($(this).val()).replace(',', '').toLowerCase();

			if (text == '') {
				switch (event.which) {
					//backspace 
					case 8:
						base.deletePrevious();
						break;

					//left arrow 
					case 37:
						base.cursorLeft();
						break;

					//right arrow 
					case 39:
						base.cursorRight();
						break;

					//delete 
					case 46:
						base.deleteNext();
						break;
				}
			}
		};

		//
		// cursorRight: Move the cursor field to the right
		//

		base.cursorRight = function () {

			base.$inputWrapper.insertAfter(base.$inputWrapper.next());
			base.$input.focus();

		};


		//
		// cursorLeft: Move the cursor field to the left
		//

		base.cursorLeft = function () {

			base.$inputWrapper.insertBefore(base.$inputWrapper.prev());
			base.$input.focus();

		};

		//
		// deleteClick: Delete the tag that was clicked on
		//

		base.deleteClick = function () {

			var tag = $(this).parent().find("span").html();
			base.removeTag(tag);
			$(this).parent().remove();
			base.$input.focus();

		};

		//
		// deletePrevious: Delete the tag to the left of the cursor
		//

		base.deletePrevious = function () {

			var tag = base.$inputWrapper.prev().find("span").html();
			base.removeTag(tag);
			base.$inputWrapper.prev().remove();
			base.$input.focus();

		};

		//
		// deleteNext: Delete the tag to the right of the cursor
		//

		base.deleteNext = function () {

			var tag = base.$inputWrapper.next().find("span").html();
			base.removeTag(tag);
			base.$inputWrapper.next().remove();
			base.$input.focus();

		};

		//
		// clearInput: Clear the input field
		//

		base.clearInput = function () {

			base.$input.val("");
			base.inputWidth = 64;
			base.$input.width(base.inputWidth);
			base.$inputWrapper.width(base.inputWidth);

		};

		//
		// resizeInput: Resize the input field to hold the current text
		//

		base.resizeInput = function () {

			base.inputWidth = base.inputWidth + 7;
			base.$input.width(base.inputWidth);
			base.$inputWrapper.width(base.inputWidth);

		};

		base.init(); // trigger the initialization
	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.Tagbox.defaults = {

		containerClass: 'fb-tagbox',
		tagClass: 'fb-tagbox-tag',
		inputClass: 'fb-tagbox-input'

	};

	//
	// setup the options provided by the instance
	// 

	$.fn.flamebug_Tagbox = function (options) {

		return this.each(function () {

			(new $.flamebug.Tagbox(this, options));

		});

	};

	//
	// getter function
	// 

	$.fn.getflamebug_Tagbox = function () {

		this.data("flamebug.Tagbox");

	};

})(jQuery);

//
// Auto Plugin elements with .fb-tagbox class
//

$(function () {

	$(".fb-tagbox").flamebug_Tagbox();

});