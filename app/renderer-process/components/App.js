import React from 'react';
import KanColle from './KanColle';

const App = props => (
	<div>
		<KanColle id={props.route.webviewId} src="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"/>
		<div>
			{props.children}
		</div>
	</div>
);

App.propTypes = {
	children: React.PropTypes.object,
	route: React.PropTypes.object
};

export default App;
