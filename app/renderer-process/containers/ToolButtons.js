import {connect} from 'react-redux';
import {takeScreenshot, setAudioMuted, setWebviewScale, setAlwaysOnTop, reloadWebview} from '../../actions';

import ToolButtons from '../components/ToolButtons';

const mapStateToProps = state => ({
	screenshotDir: state.config.screenshotDir,
	muted: state.appState.muted,
	scale: state.appState.webviewScale,
	pinned: state.appState.alwaysOnTop
});

const mapDispatchToProps = dispatch => ({
	onClickScreenshot: bounds => {
		dispatch(takeScreenshot(bounds));
	},
	onClickMute: (targetId, nextMuted) => {
		dispatch(setAudioMuted(targetId, nextMuted));
	},
	onClickPin: pinned => {
		dispatch(setAlwaysOnTop(pinned));
	},
	onClickScale: scale => {
		dispatch(setWebviewScale(scale));
	},
	onClickReload: (targetId, clearCache) => {
		dispatch(reloadWebview(targetId, clearCache));
	}
});

const ToolButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(ToolButtons);

export default ToolButtonsContainer;
