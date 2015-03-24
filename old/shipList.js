var Ship = require('./ship');

var ShipList = React.createClass({
	render: function () {
		var shipIDs =  Object.keys(db);
		shipIDs = _.chain(shipIDs)
			.sortBy(function (shipID) { return shipID; })
			.sortBy(function (shipID) { return db[shipID].mfg })
			.value();
		var ships = shipIDs.map(function (shipid) {
			return <Ship key={shipid} shipid={shipid} onUpdate={this.props.onUpdate} />
		}, this);
		return (
			<div className="shipList">
				{ships}
			</div>
		);
	}
});

module.exports = ShipList;