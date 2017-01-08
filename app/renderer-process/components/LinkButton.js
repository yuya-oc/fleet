import React from 'react';
import {Link} from 'react-router';

const linkButtonStyle = {
	color: '#333',
	textDecoration: 'none'
};

const activeStyle = {
	color: '#fff'
};

const LinkButton = props => (
	<Link style={linkButtonStyle} className="btn btn-default" to={props.to} activeClassName="active" activeStyle={activeStyle}>{props.children}</Link>  // eslint-disable-line react/forbid-component-props
);

LinkButton.propTypes = {
	to: React.PropTypes.string,
	children: React.PropTypes.node
};

export default LinkButton;
