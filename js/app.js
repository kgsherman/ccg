var ShipList = require('./startList');
var DetailList = require('./detailList');

var App = React.createClass({
	getInitialState: function () {
		return ({
			paths: null
		});
	},
	render: function () {
		return (
			<div>
				<ShipList onSelect={this.getPaths} />
				<DetailList paths={this.state.paths} />
			</div>
		);
	},
	getPaths: function (id) {
		var shipPaths = {};
		iterate(id);

		var bestShipPaths = {};
		_.each(shipPaths, function (ship, shipKey) {

			bestShipPaths[shipKey] = {};

			var bestPath = findCheapestShortest(ship.paths);
			bestShipPaths[shipKey].paths = [bestPath];

			if (bestPath.limits.length > +db[shipKey].limited) {
				var lessLimitedPaths = _.filter(ship.paths, function (path) {
					return path.limits.length < bestPath.limits.length
				});
				var groupedByLimits = _.groupBy(lessLimitedPaths, function (path) {
					return path.limits.length;
				});
				_.each(groupedByLimits, function (paths) {
					bestShipPaths[shipKey].paths.push(findCheapestShortest(paths));
				});
			}
		});

		this.setState({ paths: bestShipPaths });


		function iterate (parentID, steps, limits, totalCost) {
			totalCost = totalCost || 0;
			steps = steps || [];
			limits = limits || [];

			var connections = db[parentID].connects_to;
			if (connections.length === 0)
				return;

			connections.forEach(function (connection) {
				var childID = Object.keys(connection).pop();

				if (_.any(steps, {from: childID})) // if we're trying to return to a ship we've already gone over, skip. (prevents loops like aurora MR <-> mustang alpha)
					return;

				var cost = connection[childID];
				if (typeof cost === 'number' && cost >= 0) {
					totalCost += cost;
				} else {
					totalCost = 'unknown'
				}

				var _limits = limits.slice();
				var isLimited = db[childID].limited;
				if (isLimited) { _limits.push(childID); }

				var _steps = steps.slice();
				_steps.push({
					from: parentID,
					to: childID,
					cost: cost,
					limited: isLimited
				});

				shipPaths[childID] = shipPaths[childID] || {};
				shipPaths[childID].paths = shipPaths[childID].paths || [];
				shipPaths[childID].paths.push({
					totalCost: totalCost,
					limits: _limits,
					steps: _steps
				});

				iterate(childID, _steps, _limits, totalCost);
			});
		}

		function findCheapestShortest (paths) {
			// find lowest price
			var lowestPrice = _.min(paths, 'totalCost').totalCost;

			// find all paths with the lowest price
			var cheapestPaths = _.filter(paths, function (path) { return path.totalCost == lowestPrice; });

			// get the cheapest path with the shortest route
			var shortestPath = _.min(cheapestPaths, function (path) { return path.steps.length; });

			return shortestPath;
		}
	}
});

module.exports = App;