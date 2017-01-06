import {connect} from 'react-redux';
import {takeScreenshot, setAudioMuted} from '../../actions';

import ToolButtons from '../components/ToolButtons';

const mapStateToProps = state => ({
	muted: state.appState.muted,
	scale: state.appState.webviewScale
});

const mapDispatchToProps = dispatch => ({
	onClickScreenshot: bounds => {
		dispatch(takeScreenshot(bounds));
	},
	onClickMute: (targetId, nextMuted) => {
		dispatch(setAudioMuted(targetId, nextMuted));
	}
});

const ToolButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(ToolButtons);

export default ToolButtonsContainer;
