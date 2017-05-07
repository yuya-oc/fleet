import React from 'react';
import PropTypes from 'prop-types';
import {shell} from 'electron';
import fs from 'fs';

const Button = props => {
	const {active, btnStyle, ...reftProps} = props;
	let className = 'btn btn-large btn-default';
	if (active) {
		className += ' active';
	}
	return (
		<button className={className} style={btnStyle} {...reftProps}/>
	);
};

Button.propTypes = {
	active: PropTypes.bool,
	btnStyle: PropTypes.object
};

Button.defaultProps = {
	active: false,
	btnStyle: {}
};

const handleScreenshot = (onClick, targetId) => {
	if (onClick) {
		return () => {
			const rect = document.getElementById(targetId).getBoundingClientRect();
			const bounds = {
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height
			};
			onClick(bounds);
		};
	}
};

const handleOpenDirectory = screenshotDir => event => {
	event.preventDefault();
	if (fs.statSync(screenshotDir).isDirectory()) {
		shell.openExternal(`file://${screenshotDir}`);
	}
};

const handleMute = (onClick, targetId, muted) => {
	if (onClick) {
		return () => {
			onClick(targetId, !muted);
		};
	}
};

const handlePin = (onClick, pinned) => {
	if (onClick) {
		return () => {
			onClick(!pinned);
		};
	}
};

function getHigherScale(scales, currentScale) {
	const length = scales.length;
	const i = scales.indexOf(currentScale);
	return scales[Math.min(i + 1, length - 1)];
}

function getLowerScale(scales, currentScale) {
	const i = scales.indexOf(currentScale);
	return scales[Math.max(i - 1, 0)];
}

const ToolButtons = props => {
	const handleScaleUp = props.onClickScale.bind(this, getHigherScale(props.possibleScales, props.scale));
	const handleScaleDown = props.onClickScale.bind(this, getLowerScale(props.possibleScales, props.scale));
	const handleScaleReset = props.onClickScale.bind(this, props.initialScale);
	const handleReload = event => {
		props.onClickReload(props.screenshotTargetId, event.shiftKey);
	};
	return (
		<div>
			<div className="btn-group">
				<Button onClick={handleScreenshot(props.onClickScreenshot, props.screenshotTargetId)}>
					<span className="icon icon-camera"/>
				</Button>
				<Button onClick={handleOpenDirectory(props.screenshotDir)}>
					<span className="icon icon-folder"/>
				</Button>
			</div>
			{' '}
			<div className="btn-group">
				<Button active={props.muted} onClick={handleMute(props.onClickMute, props.screenshotTargetId, props.muted)}>
					<span className={props.muted ? 'icon icon-mute' : 'icon icon-sound'}/>
				</Button>
				<Button active={props.pinned} onClick={handlePin(props.onClickPin, props.pinned)}>
					<span className="icon icon-check"/>
				</Button>
			</div>
			{' '}
			<div className="btn-group">
				<Button onClick={handleScaleDown}>
					<span className="icon icon-minus"/>
				</Button>
				<Button btnStyle={{fontSize: '11.5px'}} onClick={handleScaleReset}>
					{`${props.scale * 100}%`}
				</Button>
				<Button onClick={handleScaleUp}>
					<span className="icon icon-plus"/>
				</Button>
			</div>
			{' '}
			<Button onClick={handleReload}>
				<span className="icon icon-cw"/>
			</Button>
		</div>
	);
};

ToolButtons.propTypes = {
	screenshotTargetId: PropTypes.string.isRequired,
	screenshotDir: PropTypes.string.isRequired,
	muted: PropTypes.bool,
	pinned: PropTypes.bool,
	scale: PropTypes.number,
	possibleScales: PropTypes.array,
	initialScale: PropTypes.number,
	onClickScreenshot: PropTypes.func,
	onClickMute: PropTypes.func,
	onClickPin: PropTypes.func,
	onClickScale: PropTypes.func,
	onClickReload: PropTypes.func
};

ToolButtons.defaultProps = {
	muted: false,
	pinned: false,
	scale: 1,
	possibleScales: [1],
	initialScale: 1,
	onClickScreenshot: null,
	onClickMute: null,
	onClickPin: null,
	onClickScale: null,
	onClickReload: null
};

export default ToolButtons;
