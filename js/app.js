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
	getPaths: function (shipid) {
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
			paths: paredResult
		});
	}
});

module.exports = App;