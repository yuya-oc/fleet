import React from 'react';

const FleetListItem = props => (
	<li className="list-group-item">
		<strong>{props.ship.name}</strong> Lv.{props.ship.level} ★{props.ship.condition}
	</li>
);

FleetListItem.propTypes = {
	ship: React.PropTypes.object
};

const FleetList = props => (
	<ul className="list-group">
		{props.ships ? props.ships.map((ship, i) => (
			<FleetListItem key={i} ship={ship}/>
		)) : null}
	</ul>
);

FleetList.propTypes = {
	ships: React.PropTypes.array
};

export default FleetList;
