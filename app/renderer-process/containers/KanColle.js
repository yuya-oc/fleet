import {connect} from 'react-redux';
import KanColle from '../components/KanColle';

const mapStateToPops = state => ({
	src: state.appState.swfURL,
	scale: state.appState.webviewScale
});

const KanColleContainer = connect(mapStateToPops)(KanColle);

export default KanColleContainer;
