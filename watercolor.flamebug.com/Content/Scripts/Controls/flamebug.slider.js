(function($) {

	//
	// flamebug Namespace
	// 

	if(!$.flamebug){

		$.flamebug = new Object();

	};


	//
	// flamebug.Slider Plugin
	// 

	$.flamebug.Slider = function(el, options) {

		var base = this;				// save the reference to this for subfunctions
		base.$el = $(el);				// jQuery version of the element
		base.el = el;					// DOM version of the element
		base.$el.data("flamebug.Slider", base);	// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function() {

			base.options = $.extend({}, $.flamebug.Slider.defaults, options);

			base.cacheElements();
			base.showButtons();
			base.showPaging();
			base.setDefaultStyles();
			base.resizeSlides();

			base.autoPlay();
			base.registerEvents();
			base.setSlide(0);
		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function() {

			base.$wrapper = base.$el.wrap('<div class="fb-slider-wrapper" />');
			base.$items = base.$el.find('> li');
			base.$slide = base.$items.filter(':first');

		};

		//
		// setDefaultStyles: Set default styles for the slider elements
		//

		base.setDefaultStyles = function() {
	
			base.$items.css({
				"display": "none",
				"position": "absolute",
				"opacity": 0,
				"top": 0,
				"left": 0,
				"z-index": 1001,
				"height": "100%"
			});

			base.$slide.css({
				"display": "block",
				"opacity": 1
			});

		};

		//
		// showButtons: Create the backward button
		//

		base.showButtons = function() {

			if (!base.options.showNavigation)
				return;

			base.$previous = $('<a class="fb-slider-arrow back">&lt;</a>');
			base.$next = $('<a class="fb-slider-arrow forward">&gt;</a>');

			// Bind the back button
			base.$previous.click(function(e) {
				base.previousSlide();
				e.preventDefault();
			});

			// Bind the forward button
			base.$next.click(function(e) {
				base.nextSlide();
				e.preventDefault();
			});

			base.$wrapper.after(base.$previous);
			base.$wrapper.after(base.$next);

		};

		//
		// showPaging: Create the next button
		//

		base.showPaging = function() {
			
			if (!base.options.showPaging)
				return;

			base.$nav = $('<ul class="fb-slider-paging"></ul>');

			for(var i=0; i < base.$items.length; i++) {
				var $item = $('<li><a>' + i + '</a></li>');

				base.pagingClick($item, i);

				base.$nav.append($item);
			}

			base.$el.after(base.$nav);
		};

		//
		// pagingClick: Create the next button
		//

		base.pagingClick = function($item, ind) {
			
			$item.click(function() {
				base.gotoSlide(ind);
			});
		};

		//
		// resizeSlides: Size the slides to fit the viewport
		//

		base.resizeSlides = function() {

			base.$items.css({"width": base.$el.width()});

		};

		//
		// autoPlay: Begin autoplay if enabled
		//

		base.autoPlay = function() {

			// Sets the playing variable to false if autoPlay is true
			base.playing = base.options.autoPlay;  

			// begin playing
			base.startStop(base.playing);

			// pause on hover
			if(base.options.pauseOnHover)
				base.$el.hover(function(){
					base.clearTimer();
				}, function(){
					base.startStop(base.playing)
				});
		};

		//
		// startStop: Start or stop the slideshow
		//

		base.startStop = function(playing) {

			if (playing !== true) 
				playing = false; //default to false if variable is not set
            
			base.playing = playing;
          
			if (playing) 
				base.setTimer();
			else 
				base.clearTimer();

		};

		//
		// setTimer: Reset the timer for the slideshow and begin playing again
		//

		base.setTimer = function() {

			base.clearTimer(); //in case triggered twice

			base.timer = window.setInterval(base.nextSlide, base.options.slideDuration);

		};

		//
		// clearTimer: Clear the current timer used for the slideshow
		//

		base.clearTimer = function() {

			if (base.timer)
				window.clearInterval(base.timer);

		};

		//
		// nextSlide: Display the next slide
		//

		base.nextSlide = function() {

			base.gotoSlide(base.currentSlide + 1);

		};

		//
		// previousSlide: Display the previous slide
		//

		base.previousSlide = function() {

			base.gotoSlide(base.currentSlide - 1);

		};

		//
		// gotoSlide: Go to a specific slide
		//

		base.gotoSlide = function(slide) {

			//alert("going to slide" + slide);
			if (base.playing)
				base.setTimer();

			base.setSlide(slide);

			$nextSlide = $(base.$items[base.currentSlide]);

			base.fadeSlide(base.$slide, $nextSlide);

			base.$slide = $nextSlide;

		};

		//
		// setSlide: Set the current slide
		//

		base.setSlide = function(slide) {

			base.currentSlide = slide;

			if(base.currentSlide >= base.$items.length)
				base.currentSlide = 0;

			if(base.currentSlide < 0)
				base.currentSlide = base.$items.length - 1;

			base.setCurrentPaging(base.currentSlide);

		};

		//
		// fadeSlide: Fade from one slide to the next
		//

		base.fadeSlide = function($slide, $nextSlide) {

			$slide.css({"z-index": 1});

			$nextSlide.css({
				"display": "block",
				"opacity": 0,
				"z-index": 1002
			});

			$nextSlide.filter(':not(:animated)').animate({opacity: 1}, base.options.animationDuration);

			$slide.animate({opacity: 0}, base.options.animationDuration, function (){

				$slide.css({"display": "none"});

			});

		};	

		//
		// setCurrentPaging: Set the current page
		//

		base.setCurrentPaging = function(slide) {

			// Set the current navigation link if enabled
			if (!base.options.showPaging) 
				return;

			base.$nav.find('.current').removeClass('current');
			var $items = base.$nav.find('li a');
			$($items[slide]).addClass('current');

		};

		//
		// registerEvents: Register Events
		//

		base.registerEvents = function() {

			//Browser Resize
			$(window).resize(base.resizeSlides);

		};

		base.init();         // Trigger the initialization

	};




	//
	// defaults: Setup the default options for the slider
	// 

	$.flamebug.Slider.defaults = {

		autoPlay: true,                 // automatically play once loaded
		showNavigation: true,		// Should the next/back buttons be shown?
		showPaging: true,		// Should the navigation buttons be shown?
		pauseOnHover: true,             // Pause when the user hovers over the slider
		slideDuration: 5000,            // How long each slide is displayed before advancing
		animationDuration: 375,         // How long the slide transition takes

	};


	//
	// setup the options provided by the slider instance
	// 

	$.fn.flamebug_Slider = function(options) {

		if (typeof (options) == "undefined") {
			return this.each(function(i) {
				(new $.flamebug.Slider(this, options));
			});
		}
		if (typeof (options) == "object") {
			return this.each(function(i) {
				(new $.flamebug.Slider(this, options));

				// This plugin supports multiple instances, but only one can support hash-tag support
				// This disables hash-tags on all items but the first one
				options.hashTags = false;
			});
		} else if (typeof (options) == "number") {

			return this.each(function(i) {
				var anySlide = $(this).data('flamebug.Slider');
				if (anySlide) {
					anySlide.gotoPage(options);
				}
			});
		}

	};

	//
	// getter function
	// 

	$.fn.getflamebug_Slider = function(){

		this.data("flamebug.Slider");

	};

})(jQuery);

//
// Auto Plugin elements with .fb-slider class
//

$(function () {

	$(".fb-slider").flamebug_Slider();

});