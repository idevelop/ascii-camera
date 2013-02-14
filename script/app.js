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
				asciiContainer.innerText = asciiString;
			});
		},

		onSuccess: function() {
			document.getElementById("info").style.display = "none";
		},

		onError: console.error
	});
})();