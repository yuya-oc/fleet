import React from 'react';
import {Button} from 'react-bootstrap';

import ScreenshotDirectoryFormGroup from '../containers/ScreenshotDirectoryFormGroup';

const handleSubmit = (callback, context) => event => {
	event.preventDefault();
	if (callback) {
		callback(context);
	}
	context.router.push('/');
};

const handleCancel = (callback, context) => () => {
	if (callback) {
		callback(context);
	}
	context.router.push('/');
};

const Settings = (props, context) => (
	<div>
		<h1>Settings</h1>
		<form onSubmit={handleSubmit(props.onSave, context)}>
			<ScreenshotDirectoryFormGroup/>
			<Button onClick={handleCancel(props.onCancel, context)} to="/">Cancel</Button>
			{' '}
			<Button bsStyle="primary" type="submit">Save</Button>
		</form>
	</div>
);

Settings.propTypes = {
	onSave: React.PropTypes.func,
	onCancel: React.PropTypes.func
};

Settings.contextTypes = {
	router: React.PropTypes.object.isRequired
};

export default Settings;
