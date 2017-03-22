import React from 'react';
import FleetList from './FleetList';
import MissionList from './MissionList';
import LinkButton from './LinkButton';

const panelStyle = {
	flex: 1,
	margin: '8px',
	minWidth: '200px'
};

const panelHeaderStyle = {
	borderBottom: '1px solid gray',
	margin: 0
};

const Overview = props => (
	<div style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'start'}}>
		<div style={panelStyle}>
			<div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', borderBottom: '1px solid gray'}}>
				<h3 style={{margin: '0px'}}>艦隊</h3>
				<div style={{display: 'flex', marginLeft: '8px'}} className="btn-group">
					<LinkButton to="/overview/0">1</LinkButton>
					<LinkButton to="/overview/1">2</LinkButton>
					<LinkButton to="/overview/2">3</LinkButton>
					<LinkButton to="/overview/3">4</LinkButton>
				</div>
			</div>
			<FleetList ships={props.ships}/>
		</div>
		<div style={panelStyle}>
			<h3 style={panelHeaderStyle}>遠征</h3>
			<MissionList currentDateValue={Date.now()} missions={props.missions}/>
		</div>
	</div>
);

Overview.propTypes = {
	ships: React.PropTypes.array,
	missions: React.PropTypes.array
};

export default Overview;
