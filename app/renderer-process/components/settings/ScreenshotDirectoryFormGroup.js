import React from 'react';
import {FormGroup, InputGroup, ControlLabel} from 'react-bootstrap';

import DirectorySelectButton from '../DirectorySelectButton';

function handleInputChange(handler) {
	return event => {
		handler(event.target.value);
	};
}

function ScreenshotDirectoryFormGroup(props) {
	return (<FormGroup>
		<ControlLabel>
			Screenshot Directory
		</ControlLabel>
		<InputGroup>
			<input className="form-control" disabled type="text" value={props.screenshotDir} onChange={handleInputChange(props.onDirectorySelect)}/>
			<InputGroup.Button>
				<DirectorySelectButton onDirectorySelect={props.onDirectorySelect}>Select</DirectorySelectButton>
			</InputGroup.Button>
		</InputGroup>
	</FormGroup>);
}

ScreenshotDirectoryFormGroup.propTypes = {
	screenshotDir: React.PropTypes.string,
	onDirectorySelect: React.PropTypes.func
};

export default ScreenshotDirectoryFormGroup;
