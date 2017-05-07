import React from 'react';
import PropTypes from 'prop-types';
import LinkTab from './LinkTab';

const Main = props => (
	<div>
		<div className="tab-group">
			<LinkTab to="/overview">
				概要
			</LinkTab>
			<LinkTab to="/settings">
				設定
			</LinkTab>
		</div>
		<div style={{padding: '8px'}}>
			{props.children}
		</div>
	</div>
);

Main.propTypes = {
	children: PropTypes.node
};

Main.defaultProps = {
	children: null
};

export default Main;
