import {connect} from 'react-redux';

import {setScreenshotDir} from '../../actions';
import ScreenshotDirectoryFormGroup from '../components/settings/ScreenshotDirectoryFormGroup';

function mapStateToPops(state) {
	return {
		screenshotDir: state.config.screenshotDir
	};
}

function mapDispathToProps(dispath) {
	return {
		onDirectorySelect: directory => {
			dispath(setScreenshotDir(directory));
		}
	};
}

const ScreenshotDirectoryFormGroupContainer = connect(mapStateToPops, mapDispathToProps)(ScreenshotDirectoryFormGroup);

export default ScreenshotDirectoryFormGroupContainer;
