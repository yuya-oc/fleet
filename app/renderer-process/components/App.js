/* eslint react/jsx-no-bind:0 */

import React from 'react';
import electron, {remote} from 'electron';

import KanColle from '../containers/KanColle';
import ToolButtons from '../containers/ToolButtons';
import Main from './Main';

const parentStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
	alignContent: 'flex-start'
};

const mainStyle = {
	position: 'relative',
	display: 'flex',
	flexFlow: 'column nowrap',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: '16px'
};

const childStyle = {
	flex: 1,
	minWidth: '250px'
};

const possibleScales = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

function getCurrentDeviceScaleFactor() {
	const currentDisplay = electron.screen.getDisplayMatching(remote.getCurrentWindow().getBounds());
	return currentDisplay.scaleFactor;
}

function getMultiplierForScaleFactor(scaleFactor) {
	const decimalPart = scaleFactor - Math.floor(scaleFactor);
	if (decimalPart !== 0) {
		return 1 / decimalPart;
	}
	return 1;
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {mainDivLeft: 0};
		this.resizeListener = this.resizeListener.bind(this);
	}

	resizeListener() {
		// make dot-by-dot for screenshot
		const scaleFactor = getCurrentDeviceScaleFactor();
		const multiplier = getMultiplierForScaleFactor(scaleFactor);

		let newX = 0;
		if (this.appDiv.clientWidth < this.mainDiv.clientWidth + 250) {
			newX = Math.round((this.appDiv.clientWidth - this.mainDiv.clientWidth) / 2);
			if (newX % multiplier !== 0) {
				newX -= newX % multiplier;
			}
		}
		this.setState({mainDivLeft: newX});
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeListener);
		this.resizeListener();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeListener);
	}

	render() {
		return (
			<div
				style={parentStyle}
				ref={div => {
					this.appDiv = div;
				}}
				>
				<div
					style={Object.assign({}, mainStyle, {left: this.state.mainDivLeft})}
					ref={div => {
						this.mainDiv = div;
					}}
					>
					<KanColle appendStyle={{marginBottom: '8px'}} muted id={this.props.route.webviewId} src="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"/>
					<ToolButtons screenshotTargetId={this.props.route.webviewId} initialScale={1.0} possibleScales={possibleScales}/>
				</div>
				<div style={childStyle}>
					<Main>
						{this.props.children}
					</Main>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	children: React.PropTypes.object,
	route: React.PropTypes.object
};

export default App;
