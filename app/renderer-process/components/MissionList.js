import React from 'react';
import PropTypes from 'prop-types';
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
	currentDateValue: PropTypes.number.isRequired,
	mission: PropTypes.object
};

MissionListItem.defaultProps = {
	mission: {
		sortie: false,
		name: 'default mission name'
	}
};

const MissionList = props => (
	<ul className="list-group">
		{props.missions ? props.missions.map((mission, i) => {
			const key = mission.id ? `mission-${mission.id}` : `mission-undefined-${i}`;
			return (
				<MissionListItem key={key} currentDateValue={props.currentDateValue} mission={mission}/>
			);
		}) : null}
	</ul>
);

MissionList.propTypes = {
	currentDateValue: PropTypes.number.isRequired,
	missions: PropTypes.array
};

MissionList.defaultProps = {
	missions: []
};

export default MissionList;
