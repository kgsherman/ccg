var gs = require('./globalStyles');
var formatPrice = require('./formatPrice');

var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var limited = db[step.ship_id].limited;
		var currency = this.props.currency;
		var vat = this.props.vat;

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
			color: '#73b1cb',
			borderLeft: '1px solid',
			borderColor: limited ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 230, 255, 0.5)'
		};

		var shipStyle = _.extend({}, gs.headerFont, limited ? gs.brightRedFont : gs.brightBlueFont, {
			height: '100%',
			textAlign: 'center',
			padding: '.5em 1em',
			display: 'inline-block',
			backgroundColor: limited ? 'rgba(178,34,34,0.2)' : 'rgba(30, 60, 100, 0.3)'
		});

		var price = step.price ? formatPrice(step.price, currency, vat) : null;
		var stepPrice = price ? <span style={priceStyle}>{price}</span> : null;

		var shipMaybeLink = step.url ?
			<a target="_blank" href={step.url}>
				<div style={limited ? limitedStyle : upgradeStyle}>
					<span style={shipStyle}>{db[step.ship_id].display}</span>
					{stepPrice}
				</div>
			</a>
			:
			<div style={limited ? limitedStyle : upgradeStyle}>
				<span style={shipStyle}>{db[step.ship_id].display}</span>
				{stepPrice}
			</div>

		return (
			<div className="step" style={style}>
				{this.props.index > 0 ? <div style={arrowStyle}></div> : null}
				{shipMaybeLink}
			</div>
		);
	}
});

module.exports = Step;