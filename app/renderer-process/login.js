const {ipcRenderer, remote} = require('electron');

function loadFrameURL() {
	let gameFrame = document.getElementById('game_frame');
	if (gameFrame) {
		window.location.href = gameFrame.src;
	}
	let embed = document.getElementById('externalswf');
	if (embed) {
		ipcRenderer.send('SET_SWF_URL', embed.src);
		remote.getCurrentWindow().close();
	}
	setTimeout(loadFrameURL, 100);
}
loadFrameURL();

const pageURL = window.location.href;
if (pageURL.includes('login')) {
	ipcRenderer.send('SHOW_LOGIN_WINDOW', true);
} else {
	ipcRenderer.send('SHOW_LOGIN_WINDOW', false);
}
if (pageURL === 'http://www.dmm.com/') {
	window.location.href = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';
}

window.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		remote.getCurrentWindow().close();
	}
});
