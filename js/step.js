var gs = require('./globalStyles');

var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var style = {
			display: this.props.show ? 'inline-block' : 'none',
			marginBottom: '0.5em'
		};
		/*var arrowStyle = _.extend({}, gs.arrowRight, {
			verticalAlign: 'middle',
			height: 36,
			display: 'inline-block'
		});*/
		var arrowStyle = {
			display: 'inline-block',
			verticalAlign: 'middle',
			background: 'url("public/little-arrow-right.png")',
			width: 7,
			height: 8,
			opacity: '0.4',
			margin: '0.25em'
		};

		var upgradeStyle = {
			display: 'inline-block',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: '5px'
		};

		var limitedStyle = _.extend({}, upgradeStyle, gs.boxRed, {
			backgroundColor: 'transparent'
		});

		var priceStyle = {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block'
		};

		var shipStyle = _.extend({}, gs.headerFont, step.limited ? gs.brightRedFont : gs.brightBlueFont, {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block',
			backgroundColor: step.limited ? 'rgba(178,34,34,0.2)' : 'rgba(30, 60, 100, 0.3)',
			borderRight: '1px solid',
			borderColor: step.limited ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 230, 255, 0.5)'
		});

		return (
			<div className="step" style={style}>
				<div style={arrowStyle}></div>
				<div style={step.limited ? limitedStyle : upgradeStyle}>
					<span style={shipStyle}>{db[step.to].display}</span>
					<span style={priceStyle}>${step.cost}</span>
				</div>
			</div>
		);
	}
});

module.exports = Step;