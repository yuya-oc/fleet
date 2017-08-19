import {dialog} from 'electron';

function confirmActuallyLaunch(win) {
	return new Promise(resolve => {
		dialog.showMessageBox(win, {
			type: 'warning',
			buttons: ['いいえ', 'はい'],
			defaultId: 0,
			title: '確認',
			message: '3隻以上の艦隊で1-1に出撃しようとしています。出撃しますか？',
			cancelId: 0
		},
		response => {
			resolve(response === 1);
		});
	});
}

export default {confirmActuallyLaunch};
