
import React from 'react';
import PropTypes from 'prop-types';
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
	to: PropTypes.string.isRequired
};

export default LinkTab;
