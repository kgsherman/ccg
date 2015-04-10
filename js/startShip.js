var gs = require('./globalStyles');
var formatPrice = require('./formatPrice');

var StartShip = React.createClass({
	render: function () {
		var data = db[this.props.id];
		var name = data.display; // TODO: add mfg before display
		var currency = this.props.currency;
		var price = data.price[currency];
		var vat = this.props.vat

		var priceREC = (data.price.rec) ? data.price.rec : "---";
		var pic = 'public/' + this.props.id + '.jpg';

		var style = {}

		style.base = {
			display: this.props.active ? 'block' : 'none',
			position: 'relative',
			width: 266,
			height: this.props.selected ? 159 : 100,
			marginTop: this.props.index == 0 ? false : '1em',
			textAlign: 'center',
			cursor: 'pointer'
		};
		style.background = {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			zIndex: '-1',
			backgroundImage: 'url("' + pic + '")',
			backgroundSize: '266px 159px',
			backgroundPosition: 'center center',
			opacity: this.props.selected ? '1' : '0.5'
		};
		style.info = {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};
		style.header = _.extend({}, gs.linebg, {
			position: 'absolute',
			top: '50%',
			right: 0,
			left: 0,
			transform: 'translateY(-50%)',
			backgroundColor: this.props.selected ? 'rgba(30, 60, 100, 0.3)' : 'rgba(0, 0, 0, 0.5)',
			borderTop: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none',
			borderBottom: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none'
		});
		style.h1 = {
			opacity: this.props.selected ? 1 : 0.7,
			margin: '0 auto',
			padding: '0.5em'
		};
		style.h4 = {
			opacity: this.props.selected ? 1 : 0.7,
			fontWeight: 'normal'
		};
		style.price = _.extend({}, gs.linebg, {
			position: 'absolute',
			bottom: 0,
			margin: 0,
			padding: '0.5em',
			backgroundColor: this.props.selected ? 'rgba(30, 60, 100, 0.3)' : 'rgba(0, 0, 0, 0.5)',
			borderTop: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none'
		});
		style.usd = _.extend({}, style.price, {
			left: 0,
			borderRight: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none'
		});
		style.rec = _.extend({}, style.price, {
			right: 0,
			borderLeft: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none'
		});

		var price = formatPrice(data.price, currency, vat);

		return (
			<div style={style.base} onClick={this.select}>
				<div style={style.background}></div>
				<div style={style.info}>
					<div style={style.header}>
						<h2 style={style.h1}>{name}</h2>
					</div>
				</div>
				<span style={style.usd}><h4 style={style.h4}>{price}</h4></span>
				<span style={style.rec}><h4 style={style.h4}>¤{priceREC}</h4></span>
			</div>
		);
	},
	select: function () {
		this.props.onSelect(this.props.id);
	}
});

module.exports = StartShip;