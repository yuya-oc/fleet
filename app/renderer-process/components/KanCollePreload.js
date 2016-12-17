/* eslint-env browser */

window.onload = function () {
	var observer = new MutationObserver(function () {
		var gameFrame = document.getElementById('game_frame');
		if (gameFrame) {
			window.location.href = gameFrame.src;
		}

		var embed = document.getElementById('externalswf');
		if (embed) {
			window.location.href = embed.src;
		}
	});

	observer.observe(document, {childList: true, subtree: true});
};
