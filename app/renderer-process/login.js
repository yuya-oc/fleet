const {ipcRenderer} = require('electron');
const url = require('url');

let webview;
window.onload = () => {
	webview = document.getElementById('webview');
	webview.addEventListener('dom-ready', () => {
		// webview.openDevTools();
		setTimeout(() => {
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
		}, 1000);
	});
	webview.addEventListener('did-finish-load', () => {
		const pageURL = webview.getURL();
		if (pageURL.includes('login')) {
			ipcRenderer.send('SHOW_LOGIN_WINDOW', true);
		} else {
			ipcRenderer.send('SHOW_LOGIN_WINDOW', false);
		}
		if (url.parse(pageURL).pathname.endsWith('.swf')) {
			ipcRenderer.send('SET_SWF_URL', pageURL);
			window.close();
		}
	});
};
