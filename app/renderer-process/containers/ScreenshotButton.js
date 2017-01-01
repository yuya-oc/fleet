import {connect} from 'react-redux';
import {takeScreenshot} from '../../actions';
import ScreenshotButton from '../components/ScreenshotButton';

function mapDispathToProps(dispatch) {
	return {
		onClick: bounds => {
			dispatch(takeScreenshot(bounds));
		}
	};
}

const ScreenshotButtonContainer = connect(null, mapDispathToProps)(ScreenshotButton);

export default ScreenshotButtonContainer;
