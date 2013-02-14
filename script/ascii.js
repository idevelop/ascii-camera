// Author: Andrei Gheorghe (http://github.com/idevelop)

var ascii = (function() {
	function asciiFromCanvas(canvas, options) {
		// Original code from http://www.nihilogic.dk/labs/jsascii/
		// Heavily modified by Andrei Gheorghe (http://github.com/idevelop)

		var characters = (" .,:;i1tfLCG08@").split("");

		var context = canvas.getContext("2d");

		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		
		var asciiCharacters = "";

		// increase the contrast of the image so that the ASCII representation looks better
		context = applyContrast(canvas, context, options.contrast);

		var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		for (var y = 0; y < canvasHeight; y += 2) { // every other row because letters are not square
			for (var x = 0; x < canvasWidth; x++) {
				// get each pixel's brightness and output corresponding character

				var offset = (y * canvasWidth + x) * 4;

				var color = {
					red: imageData.data[offset],
					green: imageData.data[offset + 1],
					blue: imageData.data[offset + 2],
					alpha: imageData.data[offset + 3]
				};
	
				// http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
				var brightness = (0.299 * color.red + 0.587 * color.green + 0.114 * color.blue) / 255;

				var character = characters[(characters.length - 1) - Math.round(brightness * (characters.length - 1))];

				asciiCharacters += character;
			}

			asciiCharacters += "\n";
		}

		options.callback(asciiCharacters);
	}

	function applyContrast(canvas, context, contrast) {
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		
		var contrastedCanvas = document.createElement("canvas");
		var contrastedContext = contrastedCanvas.getContext("2d");
		var contrastedImageData = contrastedContext.createImageData(imageData.width, imageData.height);

		var imageDataLength = imageData.data.length;
		for (var i = 0; i < imageDataLength; i += 4) {
			var color = {
				red: imageData.data[i],
				green: imageData.data[i + 1],
				blue: imageData.data[i + 2],
				alpha: imageData.data[i + 3]
			};
		
			// http://thecryptmag.com/Online/56/imgproc_5.html
			var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
			var result = {
				red: Math.floor((color.red - 128) * factor) + 128,
				green: Math.floor((color.green - 128) * factor) + 128,
				blue: Math.floor((color.blue - 128) * factor) + 128,
				alpha: color.alpha
			};

			contrastedImageData.data[i] = result.red;
			contrastedImageData.data[i + 1] = result.green;
			contrastedImageData.data[i + 2] = result.blue;
			contrastedImageData.data[i + 3] = result.alpha;
		}

		contrastedContext.putImageData(contrastedImageData, 0, 0);

		return contrastedContext;
	}

	return {
		fromCanvas: function(canvas, options) {
			options = options || {};
			options.contrast = options.contrast || 128;
			options.callback = options.callback || doNothing;

			return asciiFromCanvas(canvas, options);
		}
	};
})();
