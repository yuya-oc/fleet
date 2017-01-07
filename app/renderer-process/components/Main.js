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
	children: React.PropTypes.node
};

export default Main;
