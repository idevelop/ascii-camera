/*
 * ASCII Camera
 * http://idevelop.github.com/ascii-camera/
 *
 * Copyright 2013, Andrei Gheorghe (http://github.com/idevelop)
 * Released under the MIT license
 */

(function() {
	var asciiContainer = document.getElementById("ascii");

	camera.init({
		width: 160,
		height: 120,
		fps: 30,
		mirror: true,

		onFrame: function(canvas, context) {
			ascii.fromCanvas(canvas, context, {
				contrast: 5
			}, function(asciiString) {
				asciiContainer.innerHTML = asciiString;
			});
		},

		onSuccess: function() {
			document.getElementById("info").style.display = "none";
		},

		onError: console.error,

		onNotSupported: function() {
			document.getElementById("notSupported").style.display = "block";
		}
	});
})();