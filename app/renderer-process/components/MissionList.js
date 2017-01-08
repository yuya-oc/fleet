import React from 'react';

const MissionListItem = props => (
	<li className="list-group-item">
		<strong>{props.mission.name}</strong> {props.mission.remains}
	</li>
);

MissionListItem.propTypes = {
	mission: React.PropTypes.object
};

const MissionList = () => (
	<ul className="list-group">
		<MissionListItem mission={{name: 'TEST 1', remains: '00:20:00'}}/>
		<MissionListItem mission={{name: 'TEST 2', remains: '05:00:00'}}/>
		<MissionListItem mission={{name: 'TEST 3', remains: '02:50:00'}}/>
	</ul>
);

export default MissionList;
