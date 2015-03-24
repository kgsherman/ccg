var StartShip = require('./startShip');

var StartList = React.createClass({
	render: function () {
		var ids = Object.keys(db);
		ids = _.chain(ids)
			.sortBy(function (id) { return id; })
			.sortBy(function (id) { return db[id].mfg; })
			.value();
		var startShips = ids.map(function (id, index) {
			return <StartShip key={index} id={id} onSelect={this.props.onSelect} />
		}, this);

		return (
			<div className="startList">
				{startShips}
			</div>
		);
	}
});

module.exports = StartList;