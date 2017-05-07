import React from 'react';
import PropTypes from 'prop-types';
import {remote} from 'electron';

function selectDirectory(onSelect) {
	remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
		properties: ['openDirectory']
	}, filePaths => {
		if (filePaths && onSelect) {
			onSelect(filePaths[0]);
		}
	});
}

class DirectorySelectButton extends React.Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		selectDirectory(this.props.onDirectorySelect);
	}

	render() {
		return (
			<button className={this.props.btnClass} onClick={this.handleClick}>{this.props.children}</button>
		);
	}
}

DirectorySelectButton.propTypes = {
	btnClass: PropTypes.string,
	children: PropTypes.node,
	onDirectorySelect: PropTypes.func
};

DirectorySelectButton.defaultProps = {
	btnClass: '',
	children: null,
	onDirectorySelect: null
};

export default DirectorySelectButton;
