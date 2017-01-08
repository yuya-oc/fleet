import {connect} from 'react-redux';
import Overview from '../components/Overview';

const mapStateToProps = (state, ownProps) => {
	const index = ownProps.params.fleetIndex;
	const fleets = state.gameData.user.fleets;
	return {
		currentDateValue: state.appState.currentDateValue,
		ships: fleets[index] ? fleets[index].ships : null,
		missions: fleets.slice(1).map(fleet => fleet.mission)
	};
};

const OverviewContainer = connect(mapStateToProps)(Overview);

export default OverviewContainer;
