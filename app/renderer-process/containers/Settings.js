import {connect} from 'react-redux';

import {saveConfig, loadConfig} from '../../actions';
import Settings from '../components/Settings';

const mapStateToProps = state => ({
	screenshotDir: state.config.screenshotDir
});

const mapDispatchToProps = dispath => ({
	onSave: () => {
		dispath(saveConfig('config'));
	},
	onCancel: () => {
		dispath(loadConfig());
	}
});

const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default SettingsContainer;
