import React, {PropTypes} from 'react';

class KanColle extends React.Component {
	componentDidMount() {
		this.webview.setAttribute('plugins', true);
		this.webview.addEventListener('did-finish-load', () => {
//			console.log(this.webview.getURL());
		});
		this.webview.addEventListener('dom-ready', () => {
//			this.webview.openDevTools();
		});
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
	src: PropTypes.string.isRequired
};

export default KanColle;
