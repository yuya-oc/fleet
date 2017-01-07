import {connect} from 'react-redux';

import {setScreenshotDir} from '../../actions';
import DirectorySelectButton from '../components/DirectorySelectButton';

function mapDispathToProps(dispath) {
	return {
		onDirectorySelect: directory => {
			dispath(setScreenshotDir(directory));
		}
	};
}

const ScreenshotDirectorySelectButton = connect(null, mapDispathToProps)(DirectorySelectButton);

export default ScreenshotDirectorySelectButton;
