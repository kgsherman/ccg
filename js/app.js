var ShipList = require('./startList');
var DetailList = require('./detailList');

var App = React.createClass({
	getInitialState: function () {
		return ({
			paths: null,
			selected: null
		});
	},
	render: function () {
		var appStyle = {
			height: '100%',
			position: 'relative',
			width: '1366px',
			margin: '0 auto'
		};
		var headerStyle = {
			width: 1337, // this was not intentional.
			padding: '32px 0 16px 0',
			marginBottom: 16,
			borderBottom: '1px solid rgba(29, 63, 98, 0.9)',
			background: 'url("public/noise.png") repeat'
		};
		var h1Style = {
			display: 'inline-block',
			fontFamily: '"Electrolize", Arial, Helvetica, ans-serif',
			fontSize: 32,
			fontWeight: 'bold',
			color: '#00EBFF',
			textShadow: '0 0 50px #0074C2'
		};
		var subheaderStyle = {
			marginLeft: '1em',
			color: '#618d96'
		};
		return (
			<div id="app" style={appStyle}>
				<div style={headerStyle}>
					<h1 style={h1Style}>RSI_DB</h1>
					<span style={subheaderStyle}>Discover the best upgrades for your Star Citizen ships</span>
				</div>
				<ShipList onSelect={this.getPaths} selected={this.state.selected} />
				<DetailList paths={this.state.paths} selected={this.state.selected} />
				<div style={{clear: 'both'}}></div>
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

		this.setState({ 
			paths: bestShipPaths,
			selected: id
		});


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