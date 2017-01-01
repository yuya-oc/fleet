import {connect} from 'react-redux';

import {saveConfig, loadConfig} from '../../actions';
import Settings from '../components/Settings';

function mapDispatchToProps(dispath) {
	return {
		onSave: () => {
			dispath(saveConfig('config'));
		},
		onCancel: () => {
			dispath(loadConfig());
		}
	};
}

const SettingsContainer = connect(null, mapDispatchToProps)(Settings);

export default SettingsContainer;
