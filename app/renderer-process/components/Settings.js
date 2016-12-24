import React from 'react';
import {Button} from 'react-bootstrap';

import ScreenshotDirectoryFormGroup from '../containers/ScreenshotDirectoryFormGroup';
import LinkButton from './LinkButton';

const Settings = () => (
	<div>
		<h1>Settings</h1>
		<form>
			<ScreenshotDirectoryFormGroup/>
			<LinkButton to="/">Cancel</LinkButton>
			{' '}
			<Button type="submit">Save</Button>
		</form>
	</div>
);

export default Settings;
