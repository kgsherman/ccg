var StartShip = require('./startShip');
var Scroller = require('./scroller');
var gs = require('./globalStyles');

var StartList = React.createClass({
	getInitialState: function () {
		return ({
			filter: null,
			showAll: false
		});
	},
	render: function () {
		var ids = Object.keys(db);
		ids = _.chain(ids)
			.filter(function (id) { 
				if (this.state.showAll) return true; // dont bother if we're showing all ships

				// filter out ships without connections, or with only connections without known prices
				var connections = db[id].connects_to;
				var hasConnections = (connections.length > 0);
				var hasPrices = _.any(connections, function (connection) {
					return (connection[Object.keys(connection)[0]] >= 0); // there's gotta be a better way to check this...
				});
				return (hasConnections && hasPrices); 
			}, this)
			.sortBy(function (id) { return id; })
			.sortBy(function (id) { return db[id].mfg; })
			.value();

		if (!!this.state.filter) {
			ids = _.filter(ids, function (id) {
				return (db[id].display.toLowerCase().indexOf(this.state.filter) >= 0);
			}, this);
		}

		var startShips = ids.map(function (id, index) {
			return <StartShip key={index} index={index} id={id} onSelect={this.props.onSelect} selected={this.props.selected == id} />
		}, this);


		var style = {};
		style.base = {
			position: 'absolute',
			top: 80,
			bottom: 50,
			width: 266
		};
		style.header = {
			width: 266,
			marginBottom: '1em',
			padding: '0.5em 0',
			borderBottom: gs.dimBorder,
			textAlign: 'left'			
		};
		style.controls = {
			
		};
		style.showAll = gs.headerFont;
		style.filter = _.extend({}, gs.blueFont, {
			boxSizing: 'border-box',
			width: 266,
			padding: '10px 15px',
			background: 'rgba(0,0,0,0.4)',
			border: gs.xdimBorder,
		});
		style.shipList = {
			position: 'absolute',
			width: '100%',
			top: 120,
			bottom: 0
		};

		return (
			<div style={style.base}>
				<div style={style.header}>
					<h1>Your ship</h1>
				</div>
				<div style={style.controls}>
					<label htmlFor="showAll" style={style.showAll}>Include non-upgradeable ships: </label>
					<input type="checkbox" id="showAll" onClick={this.toggleShowAll} style={{verticalAlign: 'middle'}} />
					<input type="text" id="filter" name="filter" style={style.filter} placeholder="Search..." onInput={this.filter} />
				</div>
				<Scroller style={style.shipList} margin={'1em'}>
					{startShips}
				</Scroller>
			</div>
		);
	},
	toggleShowAll: function () {
		this.setState({
			showAll: !this.state.showAll
		});
	},
	filter: function (e) {
		this.setState({filter: e.target.value});
	}

});

module.exports = StartList;