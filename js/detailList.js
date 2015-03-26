var DetailShip = require('./detailShip');

var DetailList = React.createClass({
	render: function () {
		var ships = "Select a ship.";
		if (this.props.paths) {
			console.log(this.props.selected, this.props.paths)
			var ids = Object.keys(this.props.paths);
			ids = _.chain(ids)
				.sortBy(function (id) { return id; })
				.sortBy(function (id) { return db[id].mfg })
				.value();

			ships = ids.map(function (id, index) {
				return <DetailShip key={index} id={id} paths={this.props.paths[id]} selected={this.props.selected} />
			}, this);
		}

		var baseStyle = {
			position: 'absolute',
			left: 307,
			right: 0,
			bottom: 0,
			top: 100
		};

		var headerStyle = {
			height: 50
		};

		var detailListStyle = {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			top: 50,
			padding: '0 1em',
			overflow: 'auto'
		};

		var h1Style = {
			margin: '0 0 1em 12px',
			padding: '0.5em 0',
			width: 1020,
			borderBottom: '1px solid rgba(29, 63, 98, 0.9)'
		}

		return (
			<div style={baseStyle}>
				<div style={headerStyle}>
					<h1 style={h1Style}>Possible conversions</h1>
				</div>
				<div className="detailList" style={detailListStyle}>
					{ships}
				</div>
			</div>
		);
	}
});

module.exports = DetailList;