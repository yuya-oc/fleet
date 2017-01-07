import React from 'react';

const Button = props => {
	const {active, ...reftProps} = props;
	let className = 'btn btn-large btn-default';
	if (active) {
		className += ' active';
	}
	return (
		<button className={className} {...reftProps}/>
	);
};

Button.propTypes = {
	active: React.PropTypes.bool
};

const handleScreenshot = (onClick, targetId) => {
	if (onClick) {
		return () => {
			const rect = document.getElementById(targetId).getBoundingClientRect(); // eslint-disable-line no-undef
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

const handleMute = (onClick, targetId, muted) => {
	if (onClick) {
		return () => {
			onClick(targetId, !muted);
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
	const handleScaleUp = () => {
		props.onClickScale(getHigherScale(props.possibleScales, props.scale));
	};
	const handleScaleDown = () => {
		props.onClickScale(getLowerScale(props.possibleScales, props.scale));
	};
	const handleScaleReset = () => {
		props.onClickScale(props.initialScale);
	};
	return (
		<div>
			<div className="btn-group">
				<Button onClick={handleScreenshot(props.onClickScreenshot, props.screenshotTargetId)}>
					<span className="icon icon-camera"/>
				</Button>
				<Button active={props.muted} onClick={handleMute(props.onClickMute, props.screenshotTargetId, props.muted)}>
					<span className={props.muted ? 'icon icon-mute' : 'icon icon-sound'}/>
				</Button>
				<Button active={props.pinned} onClick={props.onClickPin}>
					<span className="icon icon-check"/>
				</Button>
			</div>
			{' '}
			<div className="btn-group">
				<Button onClick={handleScaleDown}>
					<span className="icon icon-minus"/>
				</Button>
				<Button style={{fontSize: '11.5px'}} onClick={handleScaleReset}>
					<span>{props.scale * 100}%</span>
				</Button>
				<Button onClick={handleScaleUp}>
					<span className="icon icon-plus"/>
				</Button>
			</div>
			{' '}
			<Button onClick={props.onClickReload}>
				<span className="icon icon-cw"/>
			</Button>
		</div>
	);
};

ToolButtons.propTypes = {
	screenshotTargetId: React.PropTypes.string,
	muted: React.PropTypes.bool,
	pinned: React.PropTypes.bool,
	scale: React.PropTypes.number,
	possibleScales: React.PropTypes.array,
	initialScale: React.PropTypes.number,
	onClickScreenshot: React.PropTypes.func,
	onClickMute: React.PropTypes.func,
	onClickPin: React.PropTypes.func,
	onClickScale: React.PropTypes.func,
	onClickReload: React.PropTypes.func
};

export default ToolButtons;
