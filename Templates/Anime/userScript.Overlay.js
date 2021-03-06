// ==UserScript==
// @name         Tekz rPlace Overlay
// @namespace    https://github.com/t3knical/rplace
// @version      1.0.1
// @description  overlay for r/place
// @author       Sir Teknical
// @match        https://rplace.tk/
// @icon         https://rplace.tk/favicon.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Anime/userScript.Overlay.js
// @downloadURL  https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Anime/userScript.Overlay.js
// ==/UserScript==

// options
let OVERLAY_IMAGE = "https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_just_animes_overlay.png";
let CANVAS_SIZE = [2000, 2000];
let MIN_ZOOM_LEVEL = 0.1; // minimum zoom level to display overlay

// create the overlay image
const overlayImage = new Image();
const overlayStyles = {
	position: "absolute",
	imageRendering: "pixelated",
	width: CANVAS_SIZE[0] + "px",
	height: CANVAS_SIZE[1] + "px",
	pointerEvents: "none",
};

for (let rule in overlayStyles) overlayImage.style[rule] = overlayStyles[rule];
overlayImage.src = OVERLAY_IMAGE;

// make the overlay togglable
let displayOverlay = true;
document.addEventListener("keypress", (e) => {
	if (e.code.toLowerCase() != "space") return;
	displayOverlay = !displayOverlay;
	overlayImage.style.display = displayOverlay ? "block" : "none";
});

window.addEventListener("load", () => {
	// add the overlay to the page
	let overlayParent = document.querySelector("#canvparent1"); // hijacking the snoo for our overlay

	overlayParent.style.zIndex = "3";
	overlayParent.append(overlayImage);

	// intercept position/scale changes
	let oldPos = pos;
	pos = () => {
		oldPos(); // do the normal things

		if (localStorage.z < MIN_ZOOM_LEVEL / 5) overlayImage.style.display = "none";
		else if (displayOverlay) overlayImage.style.display = "block";
	};
});
