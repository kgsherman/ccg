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
			<div id="app">
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
					return path.limits.length < bestPath.limits.length && typeof path.totalCost == 'number'
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
				var _totalCost = totalCost;
				if (typeof cost === 'number' && cost >= 0) {
					_totalCost += cost;
				} else {
					_totalCost = 'unknown'
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
					totalCost: _totalCost,
					limits: _limits,
					steps: _steps
				});

				iterate(childID, _steps, _limits, _totalCost);
			});
		}

		function findCheapestShortest (paths) {
			// find lowest price
			var lowestPrice = _.min(paths, 'totalCost').totalCost;

			// find all paths with the lowest price
			var cheapestPaths = _.filter(paths, function (path) { return path.totalCost === lowestPrice; }); 

			// find the length of the shortest route of any cheapest path
			var shortestSteps = _.min(cheapestPaths, function (path) { return path.steps.length; }).steps.length; 

			// find all of the paths that are as cheap and short as possible
			var cheapShortPaths = _.filter(cheapestPaths, function (path) { return path.steps.length == shortestSteps; });

			// get the best path with the fewest limits
			var bestPath = _.min(cheapShortPaths, function (path) { return path.limits.length; });



			//var shortestPath = _.min(cheapestPaths, function (path) { return path.steps.length; });

			return bestPath;
		}
	}
});

module.exports = App;