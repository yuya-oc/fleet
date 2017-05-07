import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {setWebviewScale} from '../../actions';

const handleSelect = (onSelect, scales) => eventKey => {
	if (onSelect) {
		onSelect(scales[eventKey]);
	}
};

const ScaleDropdownButton = props => (
	<DropdownButton title={props.title} id={props.id} onSelect={handleSelect(props.onSelect, props.scales)}>
		{props.scales.map((scale, i) => (
			<MenuItem key={`scale-button-${scale[i]}`} eventKey={i} active={scale === props.currentScale}>{`${scale * 100}%`}</MenuItem>
		))}
	</DropdownButton>
);

ScaleDropdownButton.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	currentScale: PropTypes.number.isRequired,
	scales: PropTypes.array.isRequired,
	onSelect: PropTypes.func
};

ScaleDropdownButton.defaultProps = {
	onSelect: null
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
