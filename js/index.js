/** @jsx React.DOM */

global.React = require('react');
global.db = require('./rsi_db.json');
var _ = require('lodash');
var ShipList = require('./shipList');

var Details = React.createClass({
	render: function () {
		var options = "Select a ship to peruse.";
		if (this.props.shipPaths) {
			var shipIDs =  Object.keys(this.props.shipPaths);
			shipIDs = _.chain(shipIDs)
				.sortBy(function (shipID) { return shipID; })
				.sortBy(function (shipID) { return db[shipID].mfg })
				.value();

			options = shipIDs.map(function (shipid) {
				return <ShipDetail key={shipid} id={shipid} data={this.props.shipPaths[shipid]} />
			}, this);
		}
		return (
			<div className="detail">{options}</div>
		);
		
	}
});

var ShipDetail = React.createClass({
	getInitialState: function () {
		return ({
			showJSON: 'none'
		});
	},
	render: function () {
		var paths = this.props.data;
		return (
			<div className="shipDetail">
				<h1 onClick={this.toggle}>{db[this.props.id].display}</h1>
				<pre style={{display: this.state.showJSON}}>{JSON.stringify(paths, null, '  ')}</pre>
			</div>
		);
	},
	toggle: function () {
		this.state.showJSON == 'none' ? this.setState({showJSON: 'block'}) : this.setState({showJSON: 'none'});
	}
});

var App = React.createClass({
	getInitialState: function () {
		return ({
			data: null
		});
	},
	render: function () {
		return (
			<div>
				<ShipList onUpdate={this.getOptions} />
				<Details shipPaths={this.state.data} />
			</div>
		);
	},
	getOptions: function (shipid) {
		var result = {};
		var iterate = function (fromID, currentPath, limits, totalCost) {
			if (typeof totalCost == 'undefined') { totalCost = 0; }
			if (currentPath) { currentPath = currentPath.slice(); } // make sure we're getting values, not references
			if (limits) { limits = limits.slice(); }
			var connections = db[fromID].connects_to;
			if (connections.length > 0) {
				connections.forEach(function (connection) {
					var toID = Object.keys(connection).pop();
					var copies = _.where(currentPath, { from: fromID, to: toID });
					if (copies == 0) {

						var cost = connection[toID];
						var currentCost;
						if (typeof cost == 'number' && cost >= 0) {
							currentCost = totalCost + cost;
						} else {
							currentCost = "Unknown"
						}
						
						var currentLimits = limits || [];
						currentLimits = currentLimits.slice();

						var toLimited = db[toID].limited;
						if (toLimited) { currentLimits.push(toID); }

						var newPath = currentPath || []
						newPath = newPath.slice();
						newPath.push({
							from: fromID,
							to: toID,
							cost: cost,
							limited: toLimited
						});

						result[toID] = result[toID] || {};
						result[toID].paths = result[toID].paths || [];
						result[toID].paths.push({
							limits: currentLimits,
							totalCost: currentCost,
							path: newPath
						});

						var nextPath = newPath.slice();
						var nextLimits = currentLimits.slice();
						 // failsafe for loops; i.e. mustang alpha <-> aurora mr
						if (nextPath.length < 20) {
							iterate(toID, nextPath, nextLimits, currentCost);
						}
					}
				});
			}
		}

		iterate(shipid);
		console.log(result);

		var paredResult = {};

		function findCheapestShortest (paths) {
			// find lowest price
			var lowestPrice = _.min(paths, function (pathContainer) {
				return pathContainer.totalCost;
			}).totalCost;

			// find paths that are the lowest price
			var cheapestPaths = _.filter(paths, function (pathContainer) {
				return pathContainer.totalCost == lowestPrice;
			});

			//find lowest price path with shortest route
			var shortestPath = _.min(cheapestPaths, function (pathContainer) {
				return pathContainer.path.length;
			});
			return shortestPath;
		}

		_.each(result, function (ship, shipid) {

			paredResult[shipid] = {};

			bestPath = findCheapestShortest(ship.paths);
			paredResult[shipid].paths = [bestPath];

			// if limited, see if there are paths with less limits
			if (bestPath.limits.length > +db[shipid].limited) { // unary operator (+) turns bool into 1 or 0;
				var lessLimitedPaths = _.filter(ship.paths, function (pathContainer) {
					return pathContainer.limits.length < bestPath.limits.length
				});
				var groupedByLimits = _.groupBy(lessLimitedPaths, function (pathContainer) {
					return pathContainer.limits.length;
				});
				_.each(groupedByLimits, function (paths) {
					paredResult[shipid].paths.push(findCheapestShortest(paths));
				});
			}

			
		});

		this.setState({
			data: paredResult
		});
	}
})

React.render(
  <App db={db} />,
  document.getElementById('mount')
);

module.exports = App;