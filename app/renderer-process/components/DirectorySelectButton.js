import React from 'react';
import {Button} from 'react-bootstrap';
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

	handleClick() {
		selectDirectory(this.props.onDirectorySelect);
	}

	render() {
		return (
			<Button onClick={this.handleClick}>{this.props.children}</Button>
		);
	}
}

DirectorySelectButton.propTypes = {
	children: React.PropTypes.node,
	onDirectorySelect: React.PropTypes.func
};

export default DirectorySelectButton;
