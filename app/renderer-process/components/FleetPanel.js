import React from 'react';
import {ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

const ShipList = props => (
	<ListGroup fill>
		{props.ships.map((ship, i) => (
			<ListGroupItem key={i}>{ship.name} Lv {ship.level} Condition: {ship.condition}</ListGroupItem>
		))}
	</ListGroup>
);

ShipList.propTypes = {
	ships: React.PropTypes.array
};

const FleetPanel = props => (
	<Panel header={props.fleet.name}>
		<ShipList ships={props.fleet.ships}/>
	</Panel>
);

FleetPanel.propTypes = {
	fleet: React.PropTypes.object
};

export default FleetPanel;
