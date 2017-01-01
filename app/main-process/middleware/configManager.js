import {SAVE_CONFIG, LOAD_CONFIG, setConfig} from '../../actions';
import fs from 'fs';
import path from 'path';
import {app} from 'electron';

export const configFile = path.resolve(app.getPath('userData'), 'config.json');

const configManager = store => next => action => {
	switch (action.type) {
		case SAVE_CONFIG:
			fs.writeFile(
				configFile,
				JSON.stringify(store.getState()[action.key], null, '  '),
				err => {
					if (err) {
						console.error(err);
					}
				});
			break;
		case LOAD_CONFIG:
			fs.readFile(configFile, 'utf-8', (err, data) => {
				if (err) {
					console.error(err);
				} else {
					next(setConfig(JSON.parse(data)));
				}
			});
			break;
		default:
			break;
	}
	return next(action);
};

export default configManager;
