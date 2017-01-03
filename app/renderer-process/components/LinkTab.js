import React from 'react';
import {Link, IndexLink} from 'react-router';

const LinkTab = props => {
	const LinkComponent = props.to === '/' ? IndexLink : Link;
	return (
		<LinkComponent {...props} style={{color: '#333', textDecoration: 'none'}} className="tab-item" activeClassName="active"/>
	);
};

export default LinkTab;
