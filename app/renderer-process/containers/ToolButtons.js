import {connect} from 'react-redux';
import {takeScreenshot, setAudioMuted, setWebviewScale, toggleAlwaysOnTop, reloadWebview} from '../../actions';

import ToolButtons from '../components/ToolButtons';

const mapStateToProps = state => ({
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
	onClickPin: () => {
		dispatch(toggleAlwaysOnTop());
	},
	onClickScale: scale => {
		dispatch(setWebviewScale(scale));
	},
	onClickReload: targetId => {
		dispatch(reloadWebview(targetId));
	}
});

const ToolButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(ToolButtons);

export default ToolButtonsContainer;
