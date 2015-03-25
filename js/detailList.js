var DetailShip = require('./detailShip');

var DetailList = React.createClass({
	render: function () {
		var ships = "Select a ship.";
		if (this.props.paths) {
			var ids = Object.keys(this.props.paths);
			ids = _.chain(ids)
				.sortBy(function (id) { return id; })
				.sortBy(function (id) { return db[id].mfg })
				.value();

			ships = ids.map(function (id, index) {
				return <DetailShip key={index} id={id} paths={this.props.paths[id]} selected={this.props.selected} />
			}, this);
		}

		var detailListStyle = {
			padding: '1em',
			zIndex: 1,
			backgroundColor: 'rgb(0, 11, 17)'
		}

		return (
			<div className="detailList" style={detailListStyle}>
				{ships}
			</div>
		);
	}
});

module.exports = DetailList;