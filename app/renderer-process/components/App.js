import React from 'react';
import KanColle from './KanColle';
import ScreenshotButton from './ScreenshotButton';

const App = () => (
	<div>
		<KanColle src="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"/>
		<ScreenshotButton
			screenshotBounds={{x: 0, y: 0, width: 533, height: 320}}
			screenshotDir={'.'}
			/>
	</div>
);

export default App;
