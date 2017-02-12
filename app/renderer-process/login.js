const {ipcRenderer} = require('electron');
const url = require('url');

let webview;
let timer;
window.onload = () => {
	webview = document.getElementById('webview');
	webview.addEventListener('dom-ready', () => {
		// webview.openDevTools();
		if (timer !== null) {
			timer = setInterval(() => {
				console.log('executeJavaScript');
				webview.executeJavaScript(`
					var gameFrame = document.getElementById('game_frame');
					if (gameFrame) {
						window.location.href = gameFrame.src;
					}
					var embed = document.getElementById('externalswf');
					if (embed) {
						window.location.href = embed.src;
					}
				`);
			}, 100);
		}
	});
	webview.addEventListener('did-finish-load', () => {
		const pageURL = webview.getURL();
		if (url.parse(pageURL).pathname.endsWith('.swf')) {
			ipcRenderer.send('SET_SWF_URL', pageURL);
			window.close();
		}
	});
};

window.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		window.close();
	}
});
