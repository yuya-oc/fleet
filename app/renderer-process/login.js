const {ipcRenderer, remote} = require('electron');

function log(level, message) {
	ipcRenderer.send('LOGIN-MESSAGE', level, message);
}

log('debug', `URL: ${window.location.href}`);

function loadFrameURL() {
	let gameFrame = document.getElementById('game_frame');
	if (gameFrame) {
		log('debug', `#game_frame has been found. Move to ${gameFrame.src}`);
		window.location.href = gameFrame.src;
		return;
	}
	let embed = document.getElementById('externalswf');
	if (embed) {
		log('debug', `#externalswf has been found. Use ${embed.src}`);
		ipcRenderer.send('SET_SWF_URL', embed.src);
		remote.getCurrentWindow().close();
		return;
	}
	setTimeout(loadFrameURL, 100);
}
loadFrameURL();

const pageURL = window.location.href;
if (pageURL.includes('login')) {
	log('debug', 'URL includes \'login\'. Show the modal.');
	ipcRenderer.send('SHOW_LOGIN_WINDOW', true);
} else {
	log('debug', 'URL doesn\'t include \'login\'. Hide the modal.');
	ipcRenderer.send('SHOW_LOGIN_WINDOW', false);
}
if (pageURL === 'http://www.dmm.com/' || pageURL === 'https://www.dmm.com/') {
	log('info', 'Login succeeded. Move to KanColle URL.');
	window.location.href = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';
}

window.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		remote.getCurrentWindow().close();
	}
});
