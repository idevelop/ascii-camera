var camera = (function() {
	var doNothing = function(){};

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

				if (video.mozCaptureStream) { // hack for Mozilla
					video.mozSrcObject = stream;
				} else {
					video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				}

				startVideoStream(video, options);
			}, options.onError);
		} else {
			options.onError("getUserMedia not supported");
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

		var drawInterval = Math.round(1000 / options.fps);
		var draw = function() {
			context.drawImage(video, 0, 0, video.width, video.height);
			options.onFrame(canvas, context);

			setTimeout(draw, drawInterval);
		};

		video.play();
		draw();
	}

	return {
		init: function(options) {
			options = options || {};
			options.fps = options.fps || 30;
			options.width = options.width || 640;
			options.height = options.height || 480;
			options.mirror = options.mirror || false;
			options.targetCanvas = options.targetCanvas || null;

			options.onSuccess = options.onSuccess || doNothing;
			options.onError = options.onError || doNothing;
			options.onFrame = options.onFrame || doNothing;

			initCamera(options);
		}
	};
})();