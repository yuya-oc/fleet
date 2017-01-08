import React from 'react';
import dateFormat from 'dateformat';

const MissionListItem = props => {
	const mission = props.mission;
	let remainsValue = mission.completionDateValue - props.currentDateValue;
	if (remainsValue < 0) {
		remainsValue = 0;
	}
	const remains = mission.sortie ?
		dateFormat(new Date(remainsValue), 'UTC:HH:MM:ss') :
		'--:--:--';
	return (
		<li className="list-group-item">
			<strong>{mission.sortie ? mission.name : '-'}</strong> {remains}
		</li>
	);
};

MissionListItem.propTypes = {
	currentDateValue: React.PropTypes.number,
	mission: React.PropTypes.object
};

const MissionList = props => (
	<ul className="list-group">
		{props.missions ? props.missions.map((mission, i) => (
			<MissionListItem key={i} currentDateValue={props.currentDateValue} mission={mission}/>
		)) : null}
	</ul>
);

MissionList.propTypes = {
	currentDateValue: React.PropTypes.number,
	missions: React.PropTypes.array
};

export default MissionList;
