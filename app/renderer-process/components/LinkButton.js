import React from 'react';
import {Link} from 'react-router';

const LinkButton = props => (
	<Link className="btn btn-default" to={props.to}>{props.children}</Link> // eslint-disable-line react/forbid-component-props
);

LinkButton.propTypes = {
	to: React.PropTypes.string,
	children: React.PropTypes.node
};

export default LinkButton;
