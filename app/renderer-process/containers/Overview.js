import {connect} from 'react-redux';
import Overview from '../components/Overview';
import kcsapi from '../../lib/kcsapi';

const mapStateToProps = (state, ownProps) => {
	const index = ownProps.params.fleetIndex;
	const fleets = state.gameData.user.api_deck_port ?
		[0, 1, 2, 3].map(i => kcsapi.resolveFleet(state.masterData, state.gameData.user, i)) : [];
	const missions = state.gameData.user.api_deck_port ? kcsapi.resolveMissions(state.masterData, state.gameData.user) : [];
	return {
		currentDateValue: state.appState.currentDateValue,
		ships: fleets[index] ? fleets[index].ship.map(ship => ({
			name: ship.api_name,
			level: ship.api_lv,
			condition: ship.api_cond
		})) : null,
		missions: missions.map(mission => ({
			sortie: mission.sortie,
			name: mission.api_name,
			completionDateValue: mission.completionDateValue
		}))
	};
};

const OverviewContainer = connect(mapStateToProps)(Overview);

export default OverviewContainer;
