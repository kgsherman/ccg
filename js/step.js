var gs = require('./globalStyles');

var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var limited = db[step.ship_id].limited;

		var style = {
			display: this.props.show ? 'inline-block' : 'none',
			margin: '0.5em 0'
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
			display: 'inline-block',
			color: '#73b1cb'
		};

		var shipStyle = _.extend({}, gs.headerFont, limited ? gs.brightRedFont : gs.brightBlueFont, {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block',
			backgroundColor: step.limited ? 'rgba(178,34,34,0.2)' : 'rgba(30, 60, 100, 0.3)',
			borderRight: '1px solid',
			borderColor: step.limited ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 230, 255, 0.5)'
		});

		var shipMaybeLink = step.url ?
			<a target="_blank" href={step.url}>
				<div style={limited ? limitedStyle : upgradeStyle}>
					<span style={shipStyle}>{db[step.ship_id].display}</span>
					<span style={priceStyle}>${step.price}</span>
				</div>
			</a>
			:
			<div style={limited ? limitedStyle : upgradeStyle}>
				<span style={shipStyle}>{db[step.ship_id].display}</span>
				<span style={priceStyle}>${step.price}</span>
			</div>

		return (
			<div className="step" style={style}>
				<div style={arrowStyle}></div>
				{shipMaybeLink}
			</div>
		);
	}
});

module.exports = Step;