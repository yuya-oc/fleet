const {ipcRenderer} = require('electron');
const url = require('url');

const timer = setInterval(() => { // eslint-disable-line no-unused-vars
	let gameFrame = document.getElementById('game_frame');
	if (gameFrame) {
		window.location.href = gameFrame.src;
	}
	let embed = document.getElementById('externalswf');
	if (embed) {
		window.location.href = embed.src;
	}
}, 100);

const pageURL = window.location.href;
if (pageURL.includes('login')) {
	ipcRenderer.send('SHOW_LOGIN_WINDOW', true);
} else {
	ipcRenderer.send('SHOW_LOGIN_WINDOW', false);
}
if (url.parse(pageURL).pathname.endsWith('.swf')) {
	ipcRenderer.send('SET_SWF_URL', pageURL);
	window.close();
}

window.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		window.close();
	}
});
