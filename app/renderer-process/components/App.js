import React from 'react';
import KanColle from './KanColle';

class App extends React.Component {
	render() {
		return (
			<div>
				<KanColle id={this.props.route.webviewId} src="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"/>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
}

App.propTypes = {
	children: React.PropTypes.object,
	route: React.PropTypes.object
};

export default App;
