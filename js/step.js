var gs = require('./globalStyles');

var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var style = {
			display: this.props.show ? 'inline-block' : 'none'
		};
		var arrowStyle = _.extend({}, gs.arrowRight, {
			verticalAlign: 'middle',
			height: 36,
			display: 'inline-block'
		});

		var upgradeStyle = {
			display: 'inline-block',
			backgroundColor: 'rgba(30, 60, 100, 0.3)',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: '5px'
		};

		var limitedStyle = _.extend({}, upgradeStyle, gs.boxRed);

		var priceStyle = {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block',
			borderRight: '1px solid',
			borderColor: step.limited ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 230, 255, 0.5)'
		};

		var shipStyle = {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block'
		};

		return (
			<div className="step" style={style}>
				<div style={arrowStyle}></div>
				<div style={step.limited ? limitedStyle : upgradeStyle} className={step.limited}>
					<span style={priceStyle}>${step.cost}</span>
					<span className="step-ship" style={shipStyle}>{db[step.to].display}</span>
				</div>
			</div>
		);
	}
});

module.exports = Step;