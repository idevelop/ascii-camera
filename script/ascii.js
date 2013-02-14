// Author: Andrei Gheorghe (http://github.com/idevelop)

var ascii = (function() {
	function asciiFromCanvas(canvas, context, options, callback) {
		// Original code from http://www.nihilogic.dk/labs/jsascii/
		// Heavily modified by Andrei Gheorghe (http://github.com/idevelop)

		var characters = (" .,:;i1tfLCG08@").split("");

		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var contrastAmount = options.contrast || 5;
		
		var asciiCharacters = "";

		// apply contrast
		context = applyContrast(canvas, context, contrastAmount);

		var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		for (var y = 0; y < canvasHeight; y += 2) {
			for (var x = 0; x < canvasWidth; x++) {
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

		callback(asciiCharacters);
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
		
			var result = {
				red: ((color.red - 125) * contrast) + 125,
				green: ((color.green - 125) * contrast) + 125,
				blue: ((color.blue - 125) * contrast) + 125,
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
		fromCanvas: asciiFromCanvas
	};
})();
