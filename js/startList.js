var StartShip = require('./startShip');

var StartList = React.createClass({
	render: function () {
		var ids = Object.keys(db);
		ids = _.chain(ids)
			.sortBy(function (id) { return id; })
			.sortBy(function (id) { return db[id].mfg; })
			.value();

		var startShips = ids.map(function (id, index) {
			return <StartShip key={index} id={id} onSelect={this.props.onSelect} selected={this.props.selected == id} />
		}, this);

		var startListStyle = {
			position: 'relative',
			top: '10%',
			height: '80%',
			width: '317px',
			overflowX: 'hidden',
			overflowY: 'hidden',
			textAlign: 'center'
		};

		return (
			<div className="startList customScroll" style={startListStyle}>
				{startShips}
			</div>
		);
	}
});

module.exports = StartList;