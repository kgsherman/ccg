var Ship = require('./ship');

var ShipList = React.createClass({
	render: function () {
		var ships = Object.keys(db).map(function (shipid) {
			return <Ship key={shipid} data={shipid} onUpdate={this.props.onUpdate} />
		}.bind(this));
		return (
			<div className="shipList">
				{ships}
			</div>
		);
	}
});

module.exports = ShipList;