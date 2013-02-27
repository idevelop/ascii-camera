// Author: Andrei Gheorghe (http://github.com/idevelop)
// Version: 1.0 (27.02.2013)

var camera = (function() {
	function initCamera(options) {
		var video = document.createElement("video");
		video.setAttribute('width', options.width);
		video.setAttribute('height', options.height);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

		if (navigator.getUserMedia) {
			navigator.getUserMedia({
				video: true
			}, function(stream) {
				options.onSuccess();

				if (video.mozSrcObject !== undefined) { // hack for Firefox < 19
					video.mozSrcObject = stream;
				} else {
					video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				}
				
				startVideoStream(video, options);
			}, options.onError);
		} else {
			options.onNotSupported();
		}
	}

	function startVideoStream(video, options) {
		var canvas = options.targetCanvas || document.createElement("canvas");
		canvas.setAttribute('width', options.width);
		canvas.setAttribute('height', options.height);

		var context = canvas.getContext('2d');

		// mirror video
		if (options.mirror) {
			context.translate(canvas.width, 0);
			context.scale(-1, 1);
		}

		video.play();

		setInterval(function() {
			try {
				context.drawImage(video, 0, 0, video.width, video.height);
				options.onFrame(canvas);
			} catch (e) {
				// TODO
			}
		}, Math.round(1000 / options.fps));
	}

	return {
		init: function(options) {
			var doNothing = function(){};

			options = options || {};
			options.fps = options.fps || 30;
			options.width = options.width || 640;
			options.height = options.height || 480;
			options.mirror = options.mirror || false;
			options.targetCanvas = options.targetCanvas || null; // TODO: is the element actually a <canvas> ?

			options.onSuccess = options.onSuccess || doNothing;
			options.onError = options.onError || doNothing;
			options.onNotSupported = options.onNotSupported || doNothing;
			options.onFrame = options.onFrame || doNothing;

			initCamera(options);
		},

		stop: function() {
			video.pause();

			if (video.mozSrcObject !== undefined) {
				video.mozSrcObject = null;
			} else {
				video.src = "";
			}
		}
	};
})();
