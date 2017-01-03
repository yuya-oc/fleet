import React from 'react';
import LinkTab from './LinkTab';

const Main = props => (
	<div>
		<div className="tab-group">
			<LinkTab to="/">
				概要
			</LinkTab>
			<LinkTab to="/settings">
				設定
			</LinkTab>
		</div>
		<div>
			{props.children}
		</div>
	</div>
);

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
