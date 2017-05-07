import React from 'react';
import PropTypes from 'prop-types';
import DirectorySelectButton from '../containers/ScreenshotDirectorySelectButton';

const handleSubmit = (callback, context) => event => {
	event.preventDefault();
	if (callback) {
		callback(context);
	}
	context.router.push('/');
};

const handleCancel = (callback, context) => event => {
	event.preventDefault();
	if (callback) {
		callback(context);
	}
	context.router.push('/');
};

const Settings = (props, context) => (
	<form style={{padding: '8px'}} onSubmit={handleSubmit(props.onSave, context)}>
		<div className="form-group">
			<label>スクリーンショット保存先</label><br/>
			<DirectorySelectButton btnClass="btn btn-default">選択</DirectorySelectButton>
			{` ${props.screenshotDir}`}
		</div>
		<div className="form-actions">
			<button className="btn btn-form btn-default" to="/" onClick={handleCancel(props.onCancel, context)}>キャンセル</button>
			<button className="btn btn-form btn-primary" type="submit">保存</button>
		</div>
	</form>
);

Settings.propTypes = {
	screenshotDir: PropTypes.string.isRequired,
	onSave: PropTypes.func,
	onCancel: PropTypes.func
};

Settings.defaultProps = {
	onSave: null,
	onCancel: null
};

Settings.contextTypes = {
	router: PropTypes.object.isRequired
};

export default Settings;
