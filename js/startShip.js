var StartShip = React.createClass({
	render: function () {
		var data = db[this.props.id];
		var name = data.display; // TODO: add mfg before display
		var priceUSD = (data.price.usd) ? data.price.usd : '---';
		var priceREC = (data.price.rec) ? data.price.rec : "---";
		var pic = 'public/' + this.props.id + '.jpg';
		var classes = 'startShip' + (this.props.selected ? ' startShip-selected' : '');
		var usdclass = data.limited ? 'usd limited' : 'usd';

		return (
			<div className={classes} onClick={this.select}>
				<img src={pic} />
				<div className="startShip-info">
					<div className="startShip-header line-bg">
						<h1>{name}</h1>
					</div>
				</div>
				<h4 className={usdclass}>${priceUSD}</h4>
				<h4 className="rec">¤{priceREC}</h4>
			</div>
		);
	},
	select: function () {
		this.props.onSelect(this.props.id);
	}
});

module.exports = StartShip;