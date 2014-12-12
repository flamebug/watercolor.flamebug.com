//
// Flamebug.AudioPlayer
//
// Copyright (c) 2013 Clint Kolodziej
//

(function ($) {

	//
	// flamebug Namespace
	// 

	if (!$.flamebug) {

		$.flamebug = new Object();

	};

	//
	// flamebug.AudioPlayer Plugin
	// 

	$.flamebug.AudioPlayer = function (el, options) {

		var base = this; 						// use base to avoid scope issues (instead of 'this')
		base.$el = $(el); 						// jQuery version of the element
		base.el = el; 							// DOM version of the element
		base.$el.data("flamebug.AudioPlayer", base); // reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function () {

			base.setupOptions();
			base.cacheElements();

			$el = this;

			base.bindClickEvent();
			base.setExtension();

			if (base.isFlash) {

				$("body").append($("<div id='" + base.options.flashPlayerContainer + "'>"));

				$.getScript(base.options.swfobjectPath, function () {
					swfobject.embedSWF(base.options.flashAudioPlayerPath, base.options.flashPlayerContainer, "0", "0", "9.0.0", "swf/expressInstall.swf", false, false, {
						id: base.options.flashObjectID
					}, base.swfLoaded);
				});

			} else {

				if (base.options.autoPlay) {
					base.play();
				}
			}

		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function () {

			base.options = $.extend({}, $.flamebug.AudioPlayer.defaults, options);

		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function () {

			base.isPlaying = false;
			base.isFlash = false;
			base.audio = null;

			base.$buttons = $("[data-audio]");
			base.maxIndex = base.$buttons.length - 1;
			base.$current = base.options.firstTrack;

			base.$playButton = $("[data-audio-button=play]");
			base.$pauseButton = $("[data-audio-button=pause]");
			base.$nextButton = $("[data-audio-button=next]");
			base.$prevButton = $("[data-audio-button=previous]");
		};

		//
		// bindClickEvent: Bind to the click event on the audio link buttons
		//

		base.bindClickEvent = function () {

			base.$buttons.bind("click", function (event) {

				base.updateTrackState(event);
				return false;

			});

			base.$playButton.click(base.play);
			base.$pauseButton.click(base.pause);
			base.$nextButton.click(base.next);
			base.$prevButton.click(base.previous);
		};

		//
		// setExtension: Set the audio type extension supported by the browser
		//

		base.setExtension = function () {

			for (var i = 0, ilen = base.options.codecs.length; i < ilen; i++) {

				var type = base.options.codecs[i];

				if (base.canPlay(type)) {

					base.options.extension = [".", type.name.toLowerCase()].join("");
					break;

				}

			}

			//if no extension support, set flash extension (aka .mp3 by default)
			if (!base.options.extension || base.isFlash) {

				base.isFlash = true;
				base.options.extension = base.options.flashExtension;

			}

		};

		base.play = function (element) {

			base.isPlaying = true;

			//make sure the element is a jQuery element and an audio button, if not then just replay last audio element
			if (element instanceof jQuery && element.attr("data-audio") !== undefined) {
				base.$current = element;
			}

			if (base.$current == null) {

				if (base.options.direction == "forward")
					base.$current = base.getNextTrack();
				else
					base.$current = base.getPreviousTrack();

			}

			currentTrack = base.getFileNameWithoutExtension(base.$current.attr("href"));

			base.$current.addClass(base.options.loadingClass);
			base.$buttons.removeClass(base.options.playingClass);

			if (base.isFlash) {
				if (base.audio) {
					base.removeListeners(window);
				}

				base.audio = document.getElementById(base.options.flashObjectID);

				base.addListeners(window);
				base.audio.playFlash(currentTrack + base.options.extension);
			}
			else {
				if (base.audio) {
					base.audio.pause();
					base.removeListeners(base.audio);
				}
				else {
					base.audio = new Audio("");
					base.audio.id = "audio";
					base.audio.volume = base.options.volume;
					//base.audio.loop = base.options.loop ? "loop" : "";
				}

				base.addListeners(base.audio);
				base.audio.src = currentTrack + base.options.extension;
				base.audio.play();
			}

			base.options.playTrackCallback(base.$current);
		};

		base.pause = function () {

			if (base.isFlash) {
				base.audio.pauseFlash();
			} else {
				base.audio.pause();
			}

			base.$current.removeClass(base.options.playingClass);
			base.isPlaying = false;

		};

		base.resume = function () {

			if (base.isFlash) {
				base.audio.playFlash();
			} else {
				base.audio.play();
			}

			base.$current.addClass(base.options.playingClass);
			base.isPlaying = true;

		};

		base.previous = function () {

			if (base.options.direction == "forward")
				base.play(base.getPreviousTrack());
			else
				base.play(base.getNextTrack());

		};

		base.next = function () {

			if (base.options.direction == "forward")
				base.play(base.getNextTrack());
			else
				base.play(base.getPreviousTrack());

		};

		base.playing = function () {

			return base.isPlaying;

		};

		base.onLoaded = function () {

			base.$buttons.removeClass(base.options.loadingClass);

			base.$current.addClass(base.options.playingClass);

			base.audio.play();

		};

		base.onError = function () {

			base.$buttons.removeClass(base.options.loadingClass);

			if (base.isFlash) {
				base.removeListeners(window);
			} else {
				base.removeListeners(base.audio);
			}

		};

		base.onEnded = function () {

			base.isPlaying = false;
			base.$current.removeClass(base.options.playingClass);
			currentTrack = "";
			if (base.isFlash) {
				base.removeListeners(window);
			} else {
				base.removeListeners(base.audio);
			}

			if (base.options.continuous) {

				if (base.options.direction == "forward") {

					if (base.currentIndex() < base.maxIndex)
						base.play(base.getNextTrack());
					else
						base.$current = null;

				}
				else {

					if (base.currentIndex() > 0)
						base.play(base.getPreviousTrack());
					else
						base.$current = null;
				}

			}

		};

		base.currentIndex = function () {

			return base.$buttons.index(base.$current);

		};

		base.getNextTrack = function () {

			if (base.$current == null)
				return base.$buttons.first();

			var nextIndex = base.currentIndex() + 1;

			//if we are past the end and the user manually clicks next, select the last track
			if (nextIndex > base.maxIndex)
				nextIndex = base.maxIndex;

			var $next = base.$buttons.eq(nextIndex);

			return $next;

		}

		base.getPreviousTrack = function () {

			if (base.$current == null)
				return base.$buttons.last();

			var prevIndex = base.currentIndex() - 1;

			//if we are past the beginning and the user manually clicks next, select the first track
			if (prevIndex < 0)
				prevIndex = 0;

			var $prev = base.$buttons.eq(prevIndex);

			return $prev;

		}

		base.updateTrackState = function (evt) {
			base.$current = $(evt.target);

			if (base.$current.attr("data-audio") == undefined) {
				return;
			}

			if (!base.audio || (base.audio && currentTrack !== base.getFileNameWithoutExtension(base.$current.attr("href")))) {
				base.play(base.$current);
			} else if (!base.isPlaying) {
				base.resume();
			} else {
				base.pause();
			}
		};

		base.addListeners = function (elem) {
			$(elem).bind({
				"canplay": base.onLoaded,
				"error": base.onError,
				"ended": base.onEnded
			});
		};

		base.removeListeners = function (elem) {
			$(elem).unbind({
				"canplay": base.onLoaded,
				"error": base.onError,
				"ended": base.onEnded
			});
		};

		base.canPlay = function (type) {

			if (!document.createElement("audio").canPlayType)
				return false;

			return document.createElement("audio").canPlayType(type.codec).match(/maybe|probably/i) ? true : false;

		};

		base.swfLoaded = function () {

			if (base.options.autoPlay) {
				setTimeout(function () {
					base.play(base.options.autoPlay);
				}, 500);
			}

		};

		//
		// getFileNameWithoutExtension: takes a full filename, returns it without extension (ex: audio.mp3 => audio)
		//

		base.getFileNameWithoutExtension = function (file) {

			var pieces = file.split('.');
			pieces.pop();
			return pieces.join(".");

		};

		base.init(); // trigger the initialization
	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.AudioPlayer.defaults = {

		autoPlay: false,
		/*codecs: [{
		name: "OGG",
		codec: 'audio/ogg; codecs="vorbis"'
		}, {
		name: "MP3",
		codec: 'audio/mpeg'
		}],*/
		codecs: [{
			name: "MP3",
			codec: 'audio/mpeg'
		}],
		continuous: false,
		extension: null,
		flashAudioPlayerPath: "flash/swf/player.swf",
		flashExtension: ".mp3",
		flashObjectID: "audioPlayer",
		flashPlayerContainer: "player",
		loadingClass: "loading",
		playingClass: "playing",
		swfobjectPath: "flash/swfobject/swfobject.js",
		volume: 0.5,
		//loop: false,
		direction: "forward",
		firstTrack: null,
		playTrackCallback: null
	};

	//
	// setup the options provided by the instance, if someone wants to call it from a jQuery
	// object, which doesnt really make sense in this case since everything is mostly set up by data attributes
	// 

	$.fn.flamebug_AudioPlayer = function (options) {

		return this.each(function () {

			(new $.flamebug.AudioPlayer(this, options));

		});

	};

	//
	// setup the options provided by the instance
	// 

	flamebugAudioPlayer = function (options) {

		return new $.flamebug.AudioPlayer(this, options);

	};

	//
	// getter function
	// 

	$.fn.getflamebug_AudioPlayer = function () {

		this.data("flamebug.AudioPlayer");

	};

})(jQuery);