import React from 'react';
import {connect} from 'react-redux';
import FleetPanel from '../components/FleetPanel';

const FleetList = props => (
	<div>
		{props.fleets.map((fleet, i) => (<FleetPanel key={i} fleet={fleet}/>))}
	</div>
);

FleetList.propTypes = {
	fleets: React.PropTypes.array
};

const mapStateToProps = state => ({
	fleets: state.gameData.user.fleets
});

const FleetListContainer = connect(mapStateToProps)(FleetList);

export default FleetListContainer;
