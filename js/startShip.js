var StartShip = React.createClass({
	render: function () {
		var data = db[this.props.id];
		var name = data.display; // TODO: add mfg before display
		var priceUSD = (data.price.usd) ? data.price.usd : '---';
		var priceREC = (data.price.rec) ? data.price.rec : "---";

		return (
			<div className="startShip" onClick={this.select}>
				<h1>{name}</h1>
				<p>${priceUSD} | ¤{priceREC}</p>
			</div>
		);
	},
	select: function () {
		this.props.onSelect(this.props.id);
	}
});

module.exports = StartShip;