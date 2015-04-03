var ShipList = require('./startList');
var DetailList = require('./detailList');
var Footer = require('./footer');
var About = require('./about');
var gs = require('./globalStyles');



var App = React.createClass({
	getInitialState: function () {
		return ({
			paths: null,
			selected: null,
			showAbout: false
		});
	},
	render: function () {
		var style = {};
		style.app = {
			position: 'relative',
			width: '1366px',
			height: '100%',
			margin: '0 auto'			
		};
		style.header = {
			position: 'relative',
			width: '100%',
			padding: '16px 0',
			marginBottom: 16,
			borderBottom: '1px solid rgba(29, 63, 98, 0.9)',
			background: 'url("public/noise.png") repeat'			
		};
		style.title = {
			display: 'inline-block',
			color: '#00EBFF',
			fontFamily: '"Electrolize", Arial, Helvetica, sans-serif',
			fontSize: 32,
			fontWeight: 'bold',
			textShadow: '0 0 50px #0074C2'			
		};
		style.substitle = {
			marginLeft: '1em',
			color: '#618d96'			
		};
		style.aboutLink = _.extend({}, gs.headerFont, {
			position: 'absolute',
			top: 0,
			right: 0,
			padding: '0.5em 1em',
			border: '1px solid #0c67a1',
			cursor: 'pointer'			
		});
		style.bright = _.extend({}, gs.headerFont, gs.brightBlueFont);

		var about = this.state.showAbout ? <About onKill={this.hideAbout} /> : false;

		return (
			<div id="app" style={style.app}>
				<div style={style.header}>
					<h1 style={style.title}>CCG</h1>
					<span style={style.substitle}>Discover the best upgrades for your Star Citizen ships with the <span style={style.bright}>Citizen's Conversion Guide</span></span>
					<div style={style.aboutLink} onClick={this.showAbout}>
						About this page
					</div>
				</div>
				<ShipList onSelect={this.getPaths} selected={this.state.selected} />
				<DetailList paths={this.state.paths} selected={this.state.selected} />
				<div style={{clear: 'both'}}></div>
				<Footer />
				{about}
			</div>
		);
	},
	showAbout: function () {
		this.setState({
			showAbout: true
		});
	},
	hideAbout: function () {
		this.setState({
			showAbout: false
		});
	},
	getPaths: function (seedID) {
		var _id = seedID;
		var _paths = {};

		getAllPaths();
		optimizePaths();

		console.log(_paths);
		this.setState({ 
			paths: _paths,
			selected: _id
		});


		function getAllPaths () {
			var seed = {
				limits: [],
				total: 0,
				steps: []
			};

			iterate(_id, seed);
		}
		
		function iterate (id, parentPath) {
			getConnections(id).forEach(function (connection) {
				addPath(parentPath, connection);
			});
		}

		function getConnections (id) {
			return db[id].connects_to;
		}

		function addPath (parentPath, connection) {
			// if limited, add to the parent's list of limited ships
			var limits = parentPath.limits.slice();
			if (db[connection.ship_id].limited) { limits.push(connection.ship_id); }

			// if it has price, increment the parent's. otherwise, null
			var total = (typeof connection.price == 'number') ? parentPath.total + connection.price : null;

			// copy parent's steps, and add this one
			var steps = parentPath.steps.slice();
			steps.push(connection);

			// create the new path
			var newPath = {
				limits: limits,
				total: total,
				steps: steps			
			};

			// add this path to the paths to this ship
			_paths[connection.ship_id] = _paths[connection.ship_id] || [];
			_paths[connection.ship_id].push(newPath);

			// do it again with this ship's children
			iterate(connection.ship_id, newPath);
		}

		function optimizePaths  () {
			_.each(_paths, optimizeShip)
		}

		function optimizeShip (shipPaths, shipID) {
			var groupedPathsByLimitCount = _.groupBy(shipPaths, function (path) { return path.limits.length; });

			var optimalPaths = _.map(groupedPathsByLimitCount, function (paths) {
				return getCheapestShortest(paths);
			});

			_paths[shipID] = optimalPaths;
		}

		function getCheapestShortest (paths) {

			var minPricePath = _.min(paths, function (path) { return path.total; });
			var minPrice = minPricePath.total;
			var minPricePaths = _.filter(paths, function (path) { return path.total === minPrice; });

			var minStepsPath = _.min(minPricePaths, function (path) { return path.steps.length; });
			var minSteps = minStepsPath.steps.length;
			var minStepsPaths = _.filter(minPricePaths, function (path) { return path.steps.length === minSteps; })

			return minStepsPaths[0];
		}
	},
	getPathsold: function (id) {
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


		function iterateold (parentID, steps, limits, totalCost) {
			totalCost = totalCost || 0;
			steps = steps || [];
			limits = limits || [];

			var connections = db[parentID].connects_to;
			if (connections.length === 0)
				return;

			connections.forEach(function (connection) {
				//var childID = Object.keys(connection).pop();
				var childID = connection.ship_id;

				if (_.any(steps, {from: childID})) // if we're trying to return to a ship we've already gone over, skip. (prevents loops like aurora MR <-> mustang alpha)
					return;

				var cost = connection.price;
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
					limited: isLimited,
					url: connection.url
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

		function findCheapestShortestold (paths) {
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