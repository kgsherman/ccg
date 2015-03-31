var gs = require('./globalStyles');

var StartShip = React.createClass({
	render: function () {
		var data = db[this.props.id];
		var name = data.display; // TODO: add mfg before display
		var priceUSD = (data.price.usd) ? data.price.usd : '---';
		var priceREC = (data.price.rec) ? data.price.rec : "---";
		var pic = 'public/' + this.props.id + '.jpg';
		var usdclass = data.limited ? 'usd limited' : 'usd';

		var baseStyle = {
			position: 'relative',
			width: '266px',
			height: this.props.selected ? 159 : 100,
			margin: '0 1em 1em 0',
			cursor: 'pointer',
		};

		var backgroundStyle = {
			opacity: this.props.selected ? '1' : '0.5',
			backgroundImage: 'url("' + pic + '")',
			backgroundSize: '266px 159px',
			backgroundPosition: 'center center',
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			zIndex: '-1'
		};

		var imgStyle = {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '266px',
			height: '159px',
			opacity: 0.7
		};

		var infoStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		};

		var headerStyle = _.extend({
			position: 'absolute',
			top: '50%',
			left: 0,
			right: 0,
			transform: 'translateY(-50%)',
			backgroundColor: this.props.selected ? 'rgba(30, 60, 100, 0.3)' : 'rgba(0, 0, 0, 0.5)',
			borderTop: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none',
			borderBottom: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none'
		}, gs.linebg);

		var h1Style = {
			opacity: this.props.selected ? 1 : 0.7,
			margin: '0 auto',
			padding: '0.5em'
		};

		var h4Style = {
			opacity: this.props.selected ? 1 : 0.7,
			fontWeight: 'normal'
		};

		var priceStyle = _.extend({}, gs.linebg, {
			backgroundColor: this.props.selected ? 'rgba(30, 60, 100, 0.3)' : 'rgba(0, 0, 0, 0.5)',
			borderTop: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none',
			position: 'absolute',
			bottom: 0,
			padding: '0.5em',
			margin: 0
		});

		var usdStyle = _.extend({
			borderRight: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none',
			left: 0
		}, priceStyle);

		var recStyle = _.extend({
			borderLeft: this.props.selected ? 'thin solid rgba(32, 76, 122, 0.5)' : 'none',
			right: 0
		}, priceStyle);

		return (
			<div onClick={this.select} style={baseStyle}>
				<div style={backgroundStyle}></div>
				<div className="startShip-info" style={infoStyle}>
					<div className="startShip-header line-bg" style={headerStyle}>
						<h2 style={h1Style}>{name}</h2>
					</div>
				</div>
				<span className={usdclass} style={usdStyle}><h4 style={h4Style}>${priceUSD}</h4></span>
				<span className="rec" style={recStyle}><h4 style={h4Style}>¤{priceREC}</h4></span>
			</div>
		);
	},
	select: function () {
		this.props.onSelect(this.props.id);
	}
});

module.exports = StartShip;