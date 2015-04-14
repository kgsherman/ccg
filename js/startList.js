var StartShip = require('./startShip');
var Scroller = require('./scroller');
var Check = require('./checkbox');
var gs = require('./globalStyles');

var StartList = React.createClass({
	getInitialState: function () {
		return ({
			filter: null,
			showAll: false,
			direction: this.props.initialDirection
		});
	},
	render: function () {
		var connect_direction = 'connects_' + this.state.direction;
		var ids = Object.keys(db);
		ids = _.chain(ids)
			.sortBy(function (id) { return id; })
			.sortBy(function (id) { return db[id].mfg; })
			.value();

		if (!!this.state.filter) {
			ids = _.filter(ids, function (id) {
				return (db[id].display.toLowerCase().indexOf(this.state.filter) >= 0);
			}, this);
		}

		var startShips = ids.map(function (id, index) {
			var connections = db[id][connect_direction];
			var hasConnections = (connections.length > 0);
			var hasPrices = _.any(connections, function (connection) {
				return (typeof connection.price[this.props.currency] == 'number' && connection.price[this.props.currency] >= 0);
			}, this);
			var hasPaths = (hasConnections && hasPrices); 

			return (
				<StartShip 
					key={index} index={index} 
					id={id} 
					currency={this.props.currency} 
					vat={this.props.vat} 
					onSelect={this.props.onSelect} 
					selected={this.props.selected == id} 
					active={hasPaths ? true : this.state.showAll} 
				/>
			);
		}, this);


		var style = {};
		style.base = {
			position: 'absolute',
			top: 80,
			bottom: 50,
			width: 315
		};
		style.header = {
			width: 266,
			marginBottom: '1em',
			padding: '0.5em 0',
			borderBottom: gs.dimBorder,
			textAlign: 'left'			
		};
		style.controls = {
			textAlign: 'right'
		};
		style.showAll = gs.headerFont;
		style.filter = _.extend({}, gs.blueFont, {
			boxSizing: 'border-box',
			width: 315,
			padding: '10px 15px',
			background: 'rgba(0,0,0,0.4)',
			border: gs.xdimBorder,
		});
		style.shipList = {
			position: 'absolute',
			width: 266,
			top: 140,
			bottom: 0
		};

		return (
			<div style={style.base}>
				<div style={style.header}>
					<h1>Your ship</h1>
				</div>
				<div id="shipListControls" style={style.controls}>
					<Check id='tofrom' startChecked={this.props.initialDirection === 'from'} onClick={this.toggleToFrom} label='Find upgrades...' yes='To' no='From' />
					<Check id='showAll' startChecked={false} onClick={this.toggleShowAll} label='Include non-upgradeable ships?' />
					{/*<input type="checkbox" id="showAll" onClick={this.toggleShowAll} style={{verticalAlign: 'middle'}} />*/}
					<input type="text" id="filter" name="filter" style={style.filter} placeholder="Search..." onInput={this.filter} />
				</div>

				<Scroller style={style.shipList} margin={'1em'} noResetOnUpdate={true}>
					{startShips}
				</Scroller>

			</div>
		);
	},
	toggleToFrom: function () {
		this.setState({
			direction: this.state.direction == 'to' ? 'from' : 'to'
		}, function () {
			this.props.setDirection(this.state.direction);
		});
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