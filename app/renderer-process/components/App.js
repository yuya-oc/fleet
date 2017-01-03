import React from 'react';

import KanColle from '../containers/KanColle';
import ToolButtons from '../containers/ToolButtons';
import Main from './Main';

const parentStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	justifyContent: 'center'
};

const mainStyle = {
	display: 'flex',
	flexFlow: 'column nowrap',
	justifyContent: 'center',
	alignItems: 'center'
};

const childStyle = {
	flex: 1,
	minWidth: '300px'
};

const App = props => (
	<div style={parentStyle}>
		<div style={mainStyle}>
			<KanColle muted id={props.route.webviewId} src="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"/>
			<ToolButtons screenshotTargetId={props.route.webviewId}/>
		</div>
		<div style={childStyle}>
			<Main>
				{props.children}
			</Main>
		</div>
	</div>
);

App.propTypes = {
	children: React.PropTypes.object,
	route: React.PropTypes.object
};

export default App;
