/*
 * ASCII Camera
 * http://idevelop.github.com/ascii-camera/
 *
 * Copyright 2013, Andrei Gheorghe (http://github.com/idevelop)
 * Released under the MIT license
 */

function populateDownloadLink ({ downloadEl, asciiEl }) {
	const file = new Blob([asciiEl.innerHTML], {type: 'text/plain'}) // frame data
	downloadEl.href = URL.createObjectURL(file) // inject frame into download link
	downloadEl.download = 'ascii.txt' // set file name
}

(function() {
	var asciiContainer = document.getElementById("ascii");
	var capturing = false;

	const asciiEl = document.getElementById('ascii')
	const downloadEl = document.getElementById('download')

	camera.init({
		width: 86,
		height: 64,
		fps: 30,
		mirror: true,

		onFrame: function(canvas) {
			ascii.fromCanvas(canvas, {
				// contrast: 128,
				callback: function(asciiString) {
					asciiContainer.innerHTML = asciiString;
				}
			});
			populateDownloadLink({ downloadEl, asciiEl })
		},

		onSuccess: function() {
			document.getElementById("info").style.display = "none";

			const button = document.getElementById("button");
			button.style.display = "block";
			button.onclick = function() {
				if (capturing) {
					camera.pause();
					downloadEl.click()
					button.innerText = 'start';
				} else {
					camera.start();
					button.innerText = 'capture';
				}
				capturing = !capturing;
			};
		},

		onError: function(error) {
			// TODO: log error
		},

		onNotSupported: function() {
			document.getElementById("info").style.display = "none";
			asciiContainer.style.display = "none";
			document.getElementById("notSupported").style.display = "block";
		}
	});
})();
