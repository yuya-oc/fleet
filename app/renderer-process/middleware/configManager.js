import {SAVE_CONFIG, LOAD_CONFIG, setConfig} from '../../actions';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

const configManager = userDataPath => {
	const configFile = path.resolve(userDataPath, 'config.json');
	return store => next => action => {
		switch (action.type) {
			case SAVE_CONFIG:
				fs.writeFile(
					configFile,
					JSON.stringify(store.getState()[action.key], null, '  '),
					err => {
						if (err) {
							winston.error(err);
						}
					});
				break;
			case LOAD_CONFIG:
				fs.readFile(configFile, 'utf-8', (err, data) => {
					if (err) {
						winston.error(err);
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
};

export default configManager;
