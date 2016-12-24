import {connect} from 'react-redux';
import ScreenshotButton from '../components/ScreenshotButton';

function mapStateToPops(state) {
	return {
		screenshotDir: state.config.screenshotDir
	};
}

const ScreenshotButtonContainer = connect(mapStateToPops)(ScreenshotButton);

export default ScreenshotButtonContainer;
