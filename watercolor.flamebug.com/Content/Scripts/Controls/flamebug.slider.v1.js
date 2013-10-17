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

        var base = this;                	// save the reference to this for subfunctions
        base.$el = $(el);              		// jQuery version of the element
        base.el = el;                   	// DOM version of the element
        base.$el.data("flamebug.Slider", base);	// reverse reference to the DOM object

        // Set up a few defaults
        //base.currentPage = 1;
        //base.timer = null;
        //base.playing = false;

        //
        // init: Initialize
        //

        base.init = function() {

            base.options = $.extend({}, $.flamebug.Slider.defaults, options);

            base.cacheElements();          // Cache basic elements for performance
            base.getDetails();             // Get the details of the Slider and window

            base.showBackButton();         // Show the backward navigation if needed 
            base.showNextButton();         // Show the forward navigation if needed 
            base.showPlayPauseButton();    // Show the play/pause button if needed 
            base.showNavigation();         // Show the navigation if needed

            base.setupInfiniteScrolling(); // Setup infinite scrolling if enabled    
            base.setupPauseOnHover();      // Setup pause on hover if enabled
            base.setupAutoPlay();          // Setup autoplay if enabled

            base.setCurrentPage(1);        // Initialize the current page to 1

        };


        //
        // cacheElements: Cache basic elements for performance
        //

        base.cacheElements = function() {

            base.$wrapper = base.$el.find('> div').css('overflow', 'hidden');
            base.$slider = base.$wrapper.find('> ul');
            base.$items = base.$slider.find('> li');
            base.$single = base.$items.filter(':first');

	    base.$items.css({"width": base.$wrapper.width()});

        };


        //
        // getDetails: Get basic information about the slider instance
        //

        base.getDetails = function() {

            // Get the details
            base.pageWidth = base.$wrapper.outerWidth();
            base.singleWidth = base.$single.outerWidth();
            base.pages = base.$items.length;
            base.itemsPerPage = base.pageWidth / base.singleWidth;

            if(base.options.itemsPerIncrement > base.itemsPerPage)
                base.numberOfBufferItems = base.options.itemsPerIncrement;
            else
                base.numberOfBufferItems = base.itemsPerPage;

        };


        //
        // showNavigation: Build the numbered navigation links
        //

        base.showNavigation = function() {

            // return if navigation is disabled
            if (!base.options.showNavigation)
                return;

            base.$nav = $("<div id='thumbNav'></div>").appendTo(base.$el);
            base.$items.each(function(i, el) {
                var index = i + 1;
                var $a = $("<a href='#'></a>");

                // If a formatter function is present, use it
                //if (typeof (base.options.navigationFormatter) == "function") {
                //    $a.html(base.options.navigationFormatter(index, $(this)));
                //} else {
                    $a.text(index);
                //}
                $a.click(function(e) {
                    base.gotoPage(index);

                    //if (base.options.hashTags)
                    //    base.setHash('panel-' + index);

                    e.preventDefault();
                });
                base.$nav.append($a);
            });
            base.$navLinks = base.$nav.find('> a');
        };


        //
        // showBackButton: Create the backward button
        //

        base.showBackButton = function() {

            // return if next/back buttons are disabled
            if (!base.options.showNextBack)
                return;

	    var $back =    $('<a class="arrow back">&lt;</a>');

            // Bind the back button
            $back.click(function(e) {
                base.goBack();
                e.preventDefault();
            });

            // Append elements to page
            base.$wrapper.after($back);
        };


        //
        // showNextButton: Create the next button
        //

        base.showNextButton = function() {

            // return if next/back buttons are disabled
            if (!base.options.showNextBack)
                return;

            var $forward = $('<a class="arrow forward">&gt;</a>');

            // Bind the forward button
            $forward.click(function(e) {
                base.goForward();
                e.preventDefault();
            });

            // Append elements to page
            base.$wrapper.after($forward);
        };


        //
        // setupAutoPlay: Create the play/stop button
        //

        base.setupAutoPlay = function() {

            // Sets the playing variable to false if autoPlay is true
            base.playing = base.options.autoPlay;  

            // begin playing
            base.startStop(base.playing);
        };


        //
        // setupPauseOnHover: Setup the effect to pause the timer when hovering over the slider
        //

        base.setupPauseOnHover = function() {

            if(base.options.pauseOnHover)
               base.$el.hover(function() {base.clearTimer();}, function() {base.startStop(base.playing);});

        };


        //
        // showPlayPauseButton: Create the play/pause button
        //

        base.showPlayPauseButton = function() {

            // return if play/pause is disabled
            if (!base.options.showPlayPause)
               return;

            base.$startStop = $("<a href='#' id='start-stop'></a>").html(base.playing ? base.options.pauseText : base.options.playText);
            base.$el.append(base.$startStop);
            base.$startStop.click(function(e) {
                base.startStop(!base.playing);
                e.preventDefault();
            });

        };


        //
        // setupInfiniteScrolling: Setup the effect to allow the slider to scroll infinitely
        //

        base.setupInfiniteScrolling = function() {

           // return if infinite scrolling is disabled
           if (!base.options.infiniteScrolling)
               return;

           // append the first X items to the end of the list to smooth 
           // out the transition from end to beginning
           for (var x = 0; x < base.numberOfBufferItems; x++) {

               base.$items.filter(':last').after(base.$items.filter(':eq(' + (x + 0) + ')').clone().addClass('cloned'));
               base.$items = base.$slider.find('> li'); // reselect
           }

           // append the last X items to the beginning of the list to smooth
           // out the transition from beginning to end

           for (var x = 0; x < base.numberOfBufferItems; x++) {

               var firstItem = base.$items.filter(':first');
               var lastItem = base.$items.filter(':eq(' + (base.pages - 1) + ')');

               firstItem.before(lastItem.clone().addClass('cloned'));
               base.$items = base.$slider.find('> li'); // reselect
           }

           //base.$wrapper.filter(':not(:animated)').scrollLeft(base.singleWidth * (base.numberOfBufferItems));
		base.$wrapper.scrollLeft(base.singleWidth * (base.numberOfBufferItems));
        };


        //
        // gotoPage: Go to a given page
        //

        base.gotoPage = function(page) {

            //alert("gotoPage: page=" + page);

            if (typeof (page) == "undefined" || page == null)
               return;

            if (base.playing)
               base.resetSlideShowTimer();

            var dir = page < base.currentPage ? -1 : 1;
            var n = Math.abs(base.currentPage - page)
            var left = base.singleWidth * dir * n;

            if(base.options.transition == "fade")
            {
               base.$wrapper.filter(':not(:animated)').animate({opacity: 0}, base.options.animationDuration).animate({ scrollLeft: '+=' + left }, 0, base.options.easing, function() {
                
                   base.setCurrentPage(page);

               }).animate({opacity: 1}, base.options.animationDuration);
            }
            else
            {
               base.$wrapper.filter(':not(:animated)').animate({ scrollLeft: '+=' + left }, base.options.animationDuration, base.options.easing, function() {
                
                   base.setCurrentPage(page);

               });
            }


        };


        //
        // setCurrentPage: Set the current page
        //

        base.setCurrentPage = function(page) {

            // Set the current navigation link if enabled
            if (base.options.showNavigation) 
            {
                base.$nav.find('.cur').removeClass('cur');
                $(base.$navLinks[page - 1]).addClass('cur');
            }


            base.currentPage = page;

        };


        //
        // goForward: Go forward in the paging
        //

        base.goForward = function() {

            var destinationPage = 1;

            if(base.options.infiniteScrolling)
            {
               destinationPage = base.currentPage + base.options.itemsPerIncrement;

               if(destinationPage > base.pages)
                  destinationPage = destinationPage - base.pages;

               if(base.currentPage > destinationPage)
               {
                  //fake out the current page, push it to the far left in the buffer items
                  base.currentPage = base.currentPage - base.pages;
                  base.$wrapper.filter(':not(:animated)').scrollLeft(base.singleWidth * (base.numberOfBufferItems - 1 + base.currentPage));
               }
            }
            else
            {
               destinationPage = base.currentPage + base.options.itemsPerIncrement;

               if(destinationPage > base.getMaxPage())
                  destinationPage = base.getMaxPage();

               if(base.getLastVisiblePage(base.currentPage) >= base.pages)
                  destinationPage = 1;
            }

            base.gotoPage(destinationPage);
        };


        //
        // goBack: Go backward in the paging
        //

        base.goBack = function() {

            var destinationPage = 1;

            if(base.options.infiniteScrolling)
            {
               destinationPage = base.currentPage - base.options.itemsPerIncrement;

               if(destinationPage < (2 - base.itemsPerPage))    
                  destinationPage = base.pages + destinationPage;

               if(base.currentPage < destinationPage)
               {
                  //fake out the current page, push it to the far left in the buffer items
                  base.currentPage = (base.pages + base.currentPage);
                  base.$wrapper.filter(':not(:animated)').scrollLeft(base.singleWidth * (base.currentPage + base.numberOfBufferItems - 1));
               }

            }
            else
            {
               destinationPage = base.currentPage - base.options.itemsPerIncrement;

               if(base.currentPage > 1 && destinationPage <= 1)
                  destinationPage = 1;

               if(destinationPage < 1)
                  destinationPage = base.getMaxPage();
            }

            base.gotoPage(destinationPage);

        };


        //
        // getLastVisiblePage: Get the last visible page given a page
        //

        base.getLastVisiblePage = function(page) {

            return page + base.itemsPerPage - 1;

        };


        //
        // getMaxPage: Get the maximum allowed page
        //

        base.getMaxPage = function() {

            return base.pages - base.itemsPerPage + 1;

        };


        //
        // startStop: Start or stop the slideshow
        //

        base.startStop = function(playing) {

            if (playing !== true) 
                playing = false; // Default if not supplied is false
            
            base.playing = playing;

            // toggle play/pause if enabled
            if (base.options.showPlayPause)
                base.$startStop.toggleClass("playing", playing).html(playing ? base.options.pauseText : base.options.playText);
          
            if (playing) 
                base.resetSlideShowTimer();
            else 
                base.clearTimer();

        };


        //
        // resetSlideShowTimer: Reset the timer for the slideshow and begin playing again
        //

        base.resetSlideShowTimer = function() {

            base.clearTimer(); // Just in case this was triggered twice in a row
            base.timer = window.setInterval(function() {

               if (base.options.playDirection == "forward")
                   base.goForward(true);
               else
                   base.goBack(true);

               }, base.options.slideDuration);

        };


        //
        // clearTimer: Clear the current timer used for the slideshow
        //

        base.clearTimer = function() {

            if (base.timer)
                window.clearInterval(base.timer);

        };


        base.init();         // Trigger the initialization

    };




    //
    // defaults: Setup the default options for the slider
    // 

    $.flamebug.Slider.defaults = {

        //navigationFormatter: null,      // Details at the top of the file on this use (advanced use)
        //hashTags: true,                 // Should links change the hashtag in the URL?

        showNextBack: true,             // Should the next/back buttons be shown?
        showNavigation: true,           // Should the navigation buttons be shown?
        showPlayPause: true,            // Should the play/pause button be shown?
        playText: "Play",               // Text to display on play button
        pauseText: "Pause",             // Text to display on pause button

        transition: "slide",             // "fade" or "slide"
        easing: "swing",                // "linear" or "swing" unless the easing plugin is being used
        animationDuration: 500,         // How long the slide transition takes

        autoPlay: true,                 // automatically play once loaded
        pauseOnHover: true,             // Pause when the user hovers over the slider
        playDirection: "forward",       // Direction to scroll while playing
        slideDuration: 5000,            // How long each slide is displayed before advancing

        infiniteScrolling: false,       // If true, loops the scrolling infinitely
        itemsPerIncrement: 1            // The number of items skipped each increment of next/previous

    };


    //
    // setup the options provided by the slider instance
    // 

    $.fn.flamebug_Slider = function(options) {
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


function registerSliderScript() {

	$('.fb-slider').flamebug_Slider({
		transition: "slide",
		showNavigation: false,
		showPlayPause: false,
		infiniteScrolling: true
	});

}