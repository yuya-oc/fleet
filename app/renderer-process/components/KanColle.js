import React, {PropTypes} from 'react';
import electron from 'electron';
const {remote} = electron;
import path from 'path';
import url from 'url';

function getCurrentDeviceScaleFactor() {
	const currentDisplay = electron.screen.getDisplayMatching(remote.getCurrentWindow().getBounds());
	return currentDisplay.scaleFactor;
}

function setWebViewScale(webview, scale) {
	webview.getWebContents().enableDeviceEmulation({
		deviceScaleFactor: scale,
		scale: scale / getCurrentDeviceScaleFactor()
	});
}

class KanColle extends React.Component {
	componentDidMount() {
//		this.webview.addEventListener('dom-ready', () => {
//			this.webview.openDevTools();
//		});
		this.webview.addEventListener('did-finish-load', () => {
			if (url.parse(this.webview.getURL()).pathname.endsWith('.swf')) {
				setWebViewScale(this.webview, this.props.scale);
			}
		});
		this.webview.setAttribute('plugins', true);
	}

	render() {
		const deviceScaleFactor = getCurrentDeviceScaleFactor();
		return (
			<webview
				id={this.props.id}
				style={Object.assign({}, {
					display: 'inline-flex',
					background: 'gray',
					width: `${800 * this.props.scale / deviceScaleFactor}px`,
					height: `${480 * this.props.scale / deviceScaleFactor}px`
				}, this.props.appendStyle)}
				ref={webview => { // eslint-disable-line react/jsx-no-bind
					this.webview = webview;
				}}
				src={this.props.src}
				preload={`file://${path.resolve(remote.app.getAppPath(), 'renderer-process/components/KanCollePreload.js')}`}
				/>);
	}
}

KanColle.propTypes = {
	id: PropTypes.string,
	src: PropTypes.string.isRequired,
	scale: PropTypes.number,
	appendStyle: PropTypes.object
};

KanColle.defaultProps = {
	scale: 1.0
};

export default KanColle;
