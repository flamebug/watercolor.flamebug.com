//
// Flamebug.Toggle
//
// TODO LIST:
//  
// 1. Replace "Toggle" with your Toggle name (replace all)
// 2. Set up any commonly referenced elements in function 'cacheElements'
// 3. Set up default option values in object 'defaults'
//

(function($){

	//
	// flamebug Namespace
	// 

	if(!$.flamebug){

		$.flamebug = new Object();

	};

	//
	// flamebug.Toggle Plugin
	// 

	$.flamebug.Toggle = function(el, options){

		var base = this;							// use base to avoid scope issues (instead of 'this')
		base.$el = $(el);							// jQuery version of the element
		base.el = el;								// DOM version of the element
		base.$el.data("flamebug.Toggle", base);	// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function(){

			base.setupOptions();
			base.cacheElements();
			
			base.wrapCheckboxWithDivs();
			base.attachEvents();
			base.disableTextSelection();
			
			//var resizeHandle = (base.$el.attr("data-resize-handle") == "true") ? true : false;

			//if (resizeHandle)    { base.ResizeHandle(); } else { base['handle'].css({ width: 24 }); }

			//base.ResizeHandle();
			base['handle'].css({ width: 24 });
			base.ResizeContainer();
  
			base.initialPosition();
		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function(){

			base.options = $.extend({}, $.flamebug.Toggle.defaults, options);
		
		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function() {

			// base.$element1 = base.$el.find('> div').css('overflow', 'hidden');
			// base.$element2 = base.$element1.find('> ul');
			// base.$element3 = base.$element2.find('> li');
			// base.$element4 = base.$element3.filter(':first');

		};

		// Wrap the existing input[type=checkbox] with divs for styling and grab DOM references to the created nodes
  
		base.wrapCheckboxWithDivs = function() {
			
			var labelChecked = base.$el.attr("data-label-on");
			var labelUnChecked = base.$el.attr("data-label-off");
			var containerClass = (base.$el.attr("class") == undefined) ? base.options.containerClass : base.options.containerClass + " " + base.$el.attr("class");

			if(labelChecked == undefined) labelChecked = "On";
			if(labelUnChecked == undefined) labelUnChecked = "Off";

			base.$el.wrap('<div class="' + containerClass + '" />');
			
			base.container = base.$el.parent();
			base.offLabel  = $('<label class="'+ base.options.labelOffClass +'">' + '<span>'+ labelUnChecked +'</span>' + '</label>').appendTo(base.container);
			base.offSpan   = base.offLabel.children('span');
			base.onLabel   = $('<label class="'+ base.options.labelOnClass +'">' + '<span>'+ labelChecked +'</span>' + '</label>').appendTo(base.container);
			base.onSpan    = base.onLabel.children('span');
			base.handle    = $('<div class="' + base.options.handleClass + '"></div>').appendTo(base.container);
			
		};
		
		  // Disable IE text selection, other browsers are handled in CSS
		  
		base.disableTextSelection = function() {
		  		
			if (!$.browser.msie) { return; }

			/* elements containing text should be unselectable */
			$.each([base.handle, base.offLabel, base.onLabel, base.container], function() {
			
				base.attr("unselectable", "on");
				
			});
			
		};

		base.ResizeContainer = function() {

			var onLabelWidth  = base.onLabel.width(),
			offLabelWidth = base.offLabel.width();
        
			var newWidth = (onLabelWidth > offLabelWidth) ? onLabelWidth : offLabelWidth;
			newWidth += base.handle.width() + 10; /* 10px padding in addition to label + handle */
				
			base['container'].css({ width: newWidth });
		};

		base.ResizeHandle = function() {

			var onLabelWidth  = base.onLabel.width(),
			offLabelWidth = base.offLabel.width();
        
			var newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
    
			base['handle'].css({ width: newWidth });
		};
 
		base.attachEvents = function() {
    
			// A mousedown anywhere in the control will start tracking for dragging
			base.container.bind('mousedown touchstart', function(event) {         

				event.preventDefault();
        
				if (base.$el.is(':disabled')) { return; }
          
				var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
				base.currentlyClicking = base.handle;
				base.dragStartPosition = x;
				base.handleLeftOffset  = parseInt(base.handle.css('left'), 10) || 0;
				base.dragStartedOn     = base.$el;
				
			});
    
			// Utilize event bubbling to handle drag on any element beneath the container
			base.container.bind('iPhoneDrag', function(event, x) {
			
				event.preventDefault();
        
				if (base.$el.is(':disabled')) { return; }
				if (base.$el != base.dragStartedOn) { return; }
        
				var p = (x + base.handleLeftOffset - base.dragStartPosition) / base.rightSide;
				if (p < 0) { p = 0; }
				if (p > 1) { p = 1; }
				
				base.handle.css({	left: p * base.rightSide });
				base.onLabel.css({	width: p * base.rightSide + 4 });
				base.offSpan.css({	marginRight: -p * base.rightSide });
				base.onSpan.css({	marginLeft: -(1 - p) * base.rightSide });
				
			});
    
			// Utilize event bubbling to handle drag end on any element beneath the container
			base.container.bind('iPhoneDragEnd', function(event, x) {
			
				if (base.$el.is(':disabled')) { return; }
        
				var checked;
				if (base.dragging) {
				
					var p = (x - base.dragStartPosition) / base.rightSide;
					checked = (p < 0) ? Math.abs(p) < 0.5 : p >= 0.5;
					
				}
				else {
				
					checked = !base.$el.attr('checked');
					
				}
        
				base.$el.attr('checked', checked);

				base.currentlyClicking = null;
				base.dragging = null;
				base.$el.change();
				
			});
  
			// Animate when we get a change event
			base.$el.change(function() {

				if (base.$el.is(':disabled')) {
				
					base.container.addClass(base.options.disabledClass);
					return false;
					
				}
				else {
				
					base.container.removeClass(base.options.disabledClass);
					
				}

				var new_left = base.$el.attr('checked') ? base.rightSide : 0;

				base.handle.animate({	left: new_left },							base.options.duration);
				base.onLabel.animate({	width: new_left + 23 },						base.options.duration);
				base.offSpan.animate({	marginRight: -new_left },					base.options.duration);
				base.onSpan.animate({	marginLeft: new_left - base.rightSide },	base.options.duration);

			});
			
			
			$(document).bind('mousemove touchmove', function(event) {
			
				if (!base.currentlyClicking) { return; }
				event.preventDefault();
        
				var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
				if (!base.dragging && (Math.abs(base.dragStartPosition - x) > base.options.dragThreshold)) { 
				
					base.dragging = true; 
					
				}
    
				$(event.target).trigger('iPhoneDrag', [x]);
				
			});

			// When the mouse comes up, leave drag state
			$(document).bind('mouseup touchend', function(event) {
			
				if (!base.currentlyClicking) { return; }
				event.preventDefault();
    
				var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
				$(base.currentlyClicking).trigger('iPhoneDragEnd', [x]);
				
			});
      
		};
  
  		base.initialPosition = function() {

			base.offLabel.css({ width: base.container.width() - 5 });

			var offset = ($.browser.msie && $.browser.version < 7) ? 2 : 2;
			base.rightSide = base.container.width() - base.handle.width() - offset;

			if (base.$el.is(':checked')) {
			
				base.handle.css({ left: base.rightSide });
				base.onLabel.css({ width: base.rightSide + 12 });
				base.offSpan.css({ marginRight: -base.rightSide });
				
			} 
			else {

				base.onLabel.css({ width: 23 });
				//base.onSpan.css({ marginLeft: -base.rightSide });
				
			}
    
			if (base.$el.is(':disabled')) {
			
				base.container.addClass(base.disabledClass);
				
			}
		};
  
		base.init(); // trigger the initialization
	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.Toggle.defaults = {

		duration:          200,                       // Time spent during slide animation
		dragThreshold:     5,                         // Pixels that must be dragged for a click to be ignored
		disabledClass:     'disabled',
		containerClass:    'fb-toggle',
		labelOnClass:      'fb-toggle-label-on',
		labelOffClass:     'fb-toggle-label-off',
		handleClass:       'fb-toggle-handle'

	};

	//
	// setup the options provided by the instance
	// 

	$.fn.flamebug_Toggle = function(options){

		return this.each(function(){

			(new $.flamebug.Toggle(this, options));

		});

	};

	//
	// getter function
	// 

	$.fn.getflamebug_Toggle = function(){

		this.data("flamebug.Toggle");

	};

})(jQuery);

//
// Auto Plugin elements with .fb-toggle class
//

$(function () {

	$(".fb-toggle").flamebug_Toggle();

});