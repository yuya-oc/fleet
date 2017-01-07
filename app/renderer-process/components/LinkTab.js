
import React from 'react';
import {Link, IndexLink} from 'react-router';

const linkTabStyle = {
	color: '#333',
	textDecoration: 'none'
};

const LinkTab = props => {
	const LinkComponent = props.to === '/' ? IndexLink : Link;
	return (
		<LinkComponent {...props} style={linkTabStyle} className="tab-item" activeClassName="active"/> // eslint-disable-line react/forbid-component-props
	);
};

LinkTab.propTypes = {
	to: React.PropTypes.string
};

export default LinkTab;
