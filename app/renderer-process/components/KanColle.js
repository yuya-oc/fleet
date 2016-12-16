import React, {PropTypes} from 'react';
import electron from 'electron';
const {remote} = electron;

function setWebViewScale(webview, scale) {
	const currentDisplay = electron.screen.getDisplayMatching(remote.getCurrentWindow().getBounds());
	webview.getWebContents().enableDeviceEmulation({
		deviceScaleFactor: 1,
		scale: scale / currentDisplay.scaleFactor
	});
}

class KanColle extends React.Component {
	componentDidMount() {
		this.webview.setAttribute('plugins', true);
		this.webview.addEventListener('did-finish-load', () => {
//			console.log(this.webview.getURL());
		});
		this.webview.addEventListener('dom-ready', () => {
			setWebViewScale(this.webview, this.props.scale);
		});
	}

	componentWillReceiveProps(nextProps) {
		setWebViewScale(this.webview, nextProps.scale);
	}

	render() {
		return (
			<webview
				ref={webview => { // eslint-disable-line react/jsx-no-bind
					this.webview = webview;
				}}
				src={this.props.src}
				/>);
	}
}

KanColle.propTypes = {
	src: PropTypes.string.isRequired,
	scale: PropTypes.number
};

KanColle.defaultProps = {
	scale: 1.0
};

export default KanColle;
