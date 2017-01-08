import {connect} from 'react-redux';
import Overview from '../components/Overview';

const mapStateToProps = (state, ownProps) => {
	const index = ownProps.params.fleetIndex;
	const fleets = state.gameData.user.fleets;
	return {
		ships: fleets[index] ? fleets[index].ships : null
	};
};

const OverviewContainer = connect(mapStateToProps)(Overview);

export default OverviewContainer;
