var gs = require('./globalStyles');

var StartShip = React.createClass({
	render: function () {
		var data = db[this.props.id];
		var name = data.display; // TODO: add mfg before display
		var priceUSD = (data.price.usd) ? data.price.usd : '---';
		var priceREC = (data.price.rec) ? data.price.rec : "---";
		var pic = 'public/' + this.props.id + '.jpg';
		var classes = 'startShip' + (this.props.selected ? ' startShip-selected' : '');
		var usdclass = data.limited ? 'usd limited' : 'usd';

		var baseStyle = {
			position: 'relative',
			width: '266px',
			height: '159px',
			margin: '1em'
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
			borderTop: this.props.selected ? 'thin solid rgb(32, 76, 122)' : 'none',
			borderBottom: this.props.selected ? 'thin solid rgb(32, 76, 122)' : 'none'
		}, gs.linebg);

		var h1Style = {
			opacity: this.props.selected ? 1 : 0.7,
			margin: '0 auto',
			padding: '0.5em'
		};

		var h4Style = {
			color: 'white',
			position: 'absolute',
			bottom: 0,
			padding: '0.5em',
			margin: 0
		};

		var usdStyle = _.extend({
			left: 0
		}, h4Style);

		var recStyle = _.extend({
			right: 0
		}, h4Style);

		return (
			<div className={classes} onClick={this.select} style={baseStyle}>
				<img src={pic} style={imgStyle} />
				<div className="startShip-info" style={infoStyle}>
					<div className="startShip-header line-bg" style={headerStyle}>
						<h1 style={h1Style}>{name}</h1>
					</div>
				</div>
				<h4 className={usdclass} style={usdStyle}>${priceUSD}</h4>
				<h4 className="rec" style={recStyle}>¤{priceREC}</h4>
			</div>
		);
	},
	select: function () {
		this.props.onSelect(this.props.id);
	}
});

module.exports = StartShip;