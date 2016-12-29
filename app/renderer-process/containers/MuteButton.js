import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {setAudioMuted} from '../actions';

const handleClick = (handler, props) => () => {
	const muted = !props.muted;
	const webview = document.getElementById(props.targetId); // eslint-disable-line no-undef
	webview.getWebContents().setAudioMuted(muted);
	if (handler) {
		handler(muted);
	}
};

const MuteButton = props => (
	<Button active={props.muted} onClick={handleClick(props.onClick, props)}>{props.children}</Button>
);

MuteButton.propTypes = {
	muted: React.PropTypes.bool.isRequired,
	onClick: React.PropTypes.func,
	children: React.PropTypes.node
};

function mapStateToPops(state) {
	return {
		muted: state.appState.muted
	};
}

function mapDispathToProps(dispatch) {
	return {
		onClick: muted => {
			dispatch(setAudioMuted(muted));
		}
	};
}

const MuteButtonContainer = connect(mapStateToPops, mapDispathToProps)(MuteButton);

export default MuteButtonContainer;
