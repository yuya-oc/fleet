import React from 'react';
import {connect} from 'react-redux';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {setWebviewScale} from '../actions';

const handleSelect = (onSelect, scales) => eventKey => {
	if (onSelect) {
		onSelect(scales[eventKey]);
	}
};

const ScaleDropdownButton = props => (
	<DropdownButton title={props.title} onSelect={handleSelect(props.onSelect, props.scales)} id={props.id}>
		{props.scales.map((scale, i) => (
			<MenuItem key={i} eventKey={i} active={scale === props.currentScale}>{`${scale * 100}%`}</MenuItem>
		))}
	</DropdownButton>
);

ScaleDropdownButton.propTypes = {
	id: React.PropTypes.string.isRequired,
	title: React.PropTypes.string.isRequired,
	currentScale: React.PropTypes.number.isRequired,
	scales: React.PropTypes.array.isRequired,
	onSelect: React.PropTypes.func
};

const mapStateToPops = state => ({
	title: `${state.appState.webviewScale * 100}%`,
	currentScale: state.appState.webviewScale
});

const mapDispathToProps = dispatch => ({
	onSelect: scale => {
		dispatch(setWebviewScale(scale));
	}
});

const ScaleDropdownButtonContainer = connect(mapStateToPops, mapDispathToProps)(ScaleDropdownButton);

export default ScaleDropdownButtonContainer;
