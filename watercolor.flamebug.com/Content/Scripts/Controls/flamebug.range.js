//
// Flamebug.Range
//

(function ($) {

	//
	// flamebug Namespace
	// 

	if (!$.flamebug) {

		$.flamebug = new Object();

	};

	//
	// flamebug.Range Plugin
	// 

	$.flamebug.Range = function (el, options) {

		var base = this; 						// use base to avoid scope issues (instead of 'this')
		base.$el = $(el); 						// jQuery version of the element
		base.el = el; 							// DOM version of the element
		base.$el.data("flamebug.Range", base); 	// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function () {

			base.setupOptions();
			base.cacheElements();
			base.wrapInput();

			base.registerChangeEvent();
			base.registerMouseDownEvent();
			base.registerMouseUpEvent();

			base.$bubble.hide();

		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function () {

			base.options = $.extend({}, $.flamebug.Range.defaults, options);

		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function () {

			base.$range = base.$el;
			base.unit = base.$el.attr("data-unit");

		};

		//
		// wrapInput: Wrap the input field and add the tag list
		//

		base.wrapInput = function () {

			base.$range.wrap('<div class="fb-range" />');
			base.$range.removeClass("fb-range");
			base.$wrapper = base.$range.parent();
			base.$bubble = $('<output for="' + base.$range.attr('id') + '" />').appendTo(base.$wrapper);
			base.$label = $('<span />').appendTo(base.$wrapper);

		};

		//
		// registerChangeEvent: Setup the event to handle updating the bubble when the range is changed
		//

		base.registerChangeEvent = function () {

			base.$range.change(function () {

				base.updateBubble();

				return false;

			}).trigger("change");

		}

		//
		// registerMouseDownEvent: Setup the event to handle showing the range bubble when the mouse button is pressed
		//

		base.registerMouseDownEvent = function () {

			base.$range.mousedown(function () {

				base.updateBubbleValue();
				base.updateBubblePosition();

				if (base.options.fadeBubble)
					base.$bubble.fadeIn();
				else
					base.$bubble.show();

				//do not return false, we want the event to continue, otherwise it will not let the slider move

			});

		}

		//
		// registerMouseUpEvent: Setup the event to handle hiding the range bubble when the mouse button is released
		//

		base.registerMouseUpEvent = function () {

			base.$range.mouseup(function () {

				if (base.options.fadeBubble)
					base.$bubble.fadeOut();
				else
					base.$bubble.hide();

				///do not return false, we want the event to continue, otherwise it will not let the slider to be released

			});

		}

		//
		// updateBubble: Update the range bubble with the proper value and position it
		//

		base.updateBubble = function () {

			base.updateBubbleValue();
			base.updateBubblePosition();

		}

		//
		// updateBubbleValue: Update the range bubble with the proper value
		//

		base.updateBubbleValue = function () {

			var rangeVal = base.$range.val();

			base.$bubble.text(rangeVal);
			base.$label.text(rangeVal + base.unit);

		}

		//
		// updateBubblePosition: Update the range bubble with the proper position
		//

		base.updateBubblePosition = function () {

			var rangeMin = (base.$range.attr("min")) ? base.$range.attr("min") : 0;
			var rangeMax = (base.$range.attr("max")) ? base.$range.attr("max") : 100;
			var rangeVal = base.$range.val();
			var rangeHandleWidth = 16;
			var rangePercent = (rangeVal - rangeMin) / (rangeMax - rangeMin);
			var trackWidth = base.$range.width() - rangeHandleWidth;

			var bubbleOffset = base.$bubble.width() / (-2);
			var bubbleLeft = (rangeHandleWidth / 2) - 4 + (trackWidth * rangePercent);

			base.$bubble.css({ left: bubbleLeft + bubbleOffset });

		}

		base.init(); // trigger the initialization

	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.Range.defaults = {

		fadeBubble: false		// fade in the bubble instead of just showing it

	};

	//
	// setup the options provided by the instance
	// 

	$.fn.flamebug_Range = function (options) {

		return this.each(function () {

			(new $.flamebug.Range(this, options));

		});

	};

	//
	// getter function
	// 

	$.fn.getflamebug_Range = function () {

		this.data("flamebug.Range");

	};

})(jQuery);

//
// Auto Plugin elements with .fb-range class
//

$(function () {

	$(".fb-range").flamebug_Range();

});