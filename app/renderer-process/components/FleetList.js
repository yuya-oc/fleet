import React from 'react';
import PropTypes from 'prop-types';

const FleetListItem = props => (
	<li className="list-group-item">
		<strong>{props.ship.name}</strong> Lv.{props.ship.level} ★{props.ship.condition}
	</li>
);

FleetListItem.propTypes = {
	ship: PropTypes.object
};

FleetListItem.defaultProps = {
	ship: {
		name: 'default name',
		level: 0,
		condition: 0
	}
};

const FleetList = props => (
	<ul className="list-group">
		{props.ships ? props.ships.map(ship => (
			<FleetListItem key={`ship-${ship.id}`} ship={ship}/>
		)) : null}
	</ul>
);

FleetList.propTypes = {
	ships: PropTypes.array
};

FleetList.defaultProps = {
	ships: []
};

export default FleetList;
