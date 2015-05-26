//
// Flamebug.Background
//

(function($){

	//
	// flamebug Namespace
	// 

	if(!$.flamebug){

		$.flamebug = new Object();

	};

	//
	// flamebug.Background Plugin
	// 

	$.flamebug.Background = function(el, image, options){

		var base = this;							// use base to avoid scope issues (instead of 'this')
		base.$el = $(el);							// jQuery version of the element
		base.el = el;								// DOM version of the element
		base.$el.data("flamebug.Background", base);					// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function(){

			base.setupParameters();
			base.setupOptions();
			base.cacheElements();

			base.changeBackground(image);

			base.attachContainer();

			$(window).resize(base.resizeContainer);

		};

		//
		// setupParameters: Set up parameters for the plugin
		//

		base.setupParameters = function(){

			// Set parameter default values
			if( typeof( image ) === "undefined" || image === null ) image = "";

			base.image = image;	// Store parameter value to the instance
		
		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function(){

			base.options = $.extend({}, $.flamebug.Background.defaults, options);
		
		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function() {

			base.$container = base.$el;
			base.$root = ("onorientationchange" in window) ? $(document) : $(window);

		};

		//
		// setupContainer: Cache basic elements for performance
		//

		base.setupContainer = function() {

			base.$container.css({left: 0, top: 0, position: "fixed", overflow: "hidden", zIndex: -999999, margin: 0, padding: 0, height: "100%", width: "100%"});			

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.attachImage = function() {

			base.$image = $("<img />")
			base.$image.css({position: "absolute", display: "none", margin: 0, padding: 0, border: "none", zIndex: -999999});

			base.$image.attr("src", base.image);
			base.$image.load(base.imageLoaded);

			base.$container.append(base.$image);

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.imageLoaded = function() {

			base.resizeContainer();

			base.$image.fadeIn(base.options.fadeSpeed, base.imageFadedIn);

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.imageFadedIn = function() {

			base.$oldImages.remove();

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.attachContainer = function() {

			$("body").append(base.$container);

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.resizeContainer = function(callback) {

			var imgRatio = base.$image.width() / base.$image.height();
			var width = base.$root.width();
			var height = width / imgRatio;

			if(height >= base.$root.height())
			{
				var offset = (height - base.$root.height()) / 2;
			
				if(base.options.centerY)
					base.$image.css({"top": "-" + offset + "px", "left": 0});
			}
			else
			{
				
				height = base.$root.height();
				width = height * imgRatio;
				var offset = (width - base.$root.width()) / 2;

				if(base.options.centerX)
					base.$image.css({"top": 0, "left": "-" + offset + "px"});
			}

			base.$image.width(width);

			//if(width != base.$container.width())
				base.$container.width(width);

			base.$image.height(height);

			//if(height != base.$container.height())
				base.$container.height(height);

		};

		//
		// attachContainer: Cache basic elements for performance
		//

		base.changeBackground = function(image) {

			base.image = image;
			base.$oldImages = base.$el.find("img");

			base.setupContainer();
			base.attachImage();

		};

		base.init(); // trigger the initialization
		
	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.Background.defaults = {

		centerX: true,
		centerY: true,
		fadeSpeed: 2000

	};

	//
	// setup the options provided by the instance
	// 

	$.fn.flamebug_Background = function(image, options){

		return this.each(function(){

			(new $.flamebug.Background(this, image, options));

		});

	};

	//
	// getter function
	// 

	$.fn.getflamebug_Background = function(){

		this.data("flamebug.Background");

	};
})(jQuery);