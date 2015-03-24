var Ship = React.createClass({
	render: function () {
		var data = db[this.props.data]
		var priceusd = (data.price.usd) ? "$" + data.price.usd : 'Not purchasable';
		var pricerec = (data.price.rec) ? '¤' + data.price.rec : "Not rentable";
		return (
			<div className="ship" onClick={this.update}>
				<h1>{data.display}</h1>
				<p>{priceusd} | {pricerec}</p>
			</div>
		);
	},
	update: function () {
		this.props.onUpdate(this.props.data);
	}
});

module.exports = Ship;