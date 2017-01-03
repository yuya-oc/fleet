import {connect} from 'react-redux';
import {takeScreenshot, setAudioMuted} from '../../actions';

import ToolButtons from '../components/ToolButtons';

const mapStateToProps = state => ({
	muted: state.appState.muted,
	scale: state.appState.webviewScale
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onClickScreenshot: bounds => {
		dispatch(takeScreenshot(bounds));
	},
	onClickMute: nextMuted => {
		dispatch(setAudioMuted(nextMuted));
	}
});

const ToolButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(ToolButtons);

export default ToolButtonsContainer;
