import React from 'react';
import DirectorySelectButton from '../containers/ScreenshotDirectorySelectButton';

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
	<form onSubmit={handleSubmit(props.onSave, context)}>
		<div className="form-group">
			<label>Screenshot directory</label><br/>
			<DirectorySelectButton btnClass="btn btn-default">Select</DirectorySelectButton>
			{` ${props.screenshotDir}`}
		</div>
		<div className="form-actions">
			<button className="btn btn-form btn-default" onClick={handleCancel(props.onCancel, context)} to="/">Cancel</button>
			<button className="btn btn-form btn-primary" type="submit">Save</button>
		</div>
	</form>
);

Settings.propTypes = {
	screenshotDir: React.PropTypes.string,
	onSave: React.PropTypes.func,
	onCancel: React.PropTypes.func
};

Settings.contextTypes = {
	router: React.PropTypes.object.isRequired
};

export default Settings;
