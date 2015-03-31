var StartShip = require('./startShip');

var StartList = React.createClass({
	getInitialState: function () {
		return ({
			filter: null
		});
	},
	render: function () {
		var ids = Object.keys(db);
		ids = _.chain(ids)
			.filter(function (id) { 
				// filter out ships without connections, or with only connections without known prices
				var connections = db[id].connects_to;
				var hasConnections = (connections.length > 0);
				var hasPrices = _.any(connections, function (connection) {
					return (connection[Object.keys(connection)[0]] >= 0); // there's gotta be a better way to check this...
				});
				return (hasConnections && hasPrices); 
			})
			.sortBy(function (id) { return id; })
			.sortBy(function (id) { return db[id].mfg; })
			.value();

		if (!!this.state.filter) {
			ids = _.filter(ids, function (id) {
				return (db[id].display.toLowerCase().indexOf(this.state.filter) >= 0);
			}, this);
		}

		var startShips = ids.map(function (id, index) {
			return <StartShip key={index} id={id} onSelect={this.props.onSelect} selected={this.props.selected == id} />
		}, this);

		var startFilterStyle = {
			height: 50,
			textAlign: 'left'
		}

		var baseStyle = {
			position: 'absolute',
			top: 100,
			bottom: 50,
			width: '307px',
			overflowX: 'hidden',
			
			textAlign: 'center'
		};

		var shipsStyle = {
			width: '307px',
			overflowY: 'scroll',
			position: 'absolute',
			top: 50,
			bottom: 0
		};

		var filterTextStyle = {
			boxSizing: 'border-box',
			background: 'rgba(0,0,0,0.4)',
			border: '1px solid rgba(22,42,63,0.8)',
			color: '#355e78',
			width: 266,
			padding: '10px 15px',
		};

		return (
			<div style={baseStyle}>
				<div className="startFilter" style={startFilterStyle}>
					<input type="text" id="filter" name="filter" style={filterTextStyle} placeholder="Search..." onInput={this.filter} />
				</div>
				<div className="startList" style={shipsStyle}>
					{startShips}
				</div>
			</div>
		);
	},
	filter: function (e) {
		this.setState({filter: e.target.value});
	}

});

module.exports = StartList;