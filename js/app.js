var ShipList = require('./startList');
var DetailList = require('./detailList');
var Footer = require('./footer');
var About = require('./about');
var Localization = require('./localization');
var gs = require('./globalStyles');

var App = React.createClass({
	getInitialState: function () {
		return ({
			currency: 'usd',
			vat: 0,
			includeVAT: true,
			paths: null,
			selected: null,
			showAbout: false,
			direction: 'to'
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
			left: '50%',
			padding: '0.5em 1em',
			border: '1px solid #0c67a1',
			transform: 'translateX(-50%)',
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
					<Localization onChangeCurrency={this.updateCurrency} onChangeVAT={this.updateVAT} onToggleIncludeVAT={this.toggleIncludeVAT} />
				</div>
				<ShipList currency={this.state.currency} vat={this.state.includeVAT ? this.state.vat : 0} onSelect={this.updatePaths} setDirection={this.setDirection} selected={this.state.selected} />
				<DetailList currency={this.state.currency} vat={this.state.includeVAT ? this.state.vat : 0} paths={this.state.paths} direction={this.state.direction} selected={this.state.selected} />
				<div style={{clear: 'both'}}></div>
				<Footer />
				{about}
			</div>
		);
	},
	setDirection: function (dir) {
		this.setState({ direction: dir }, this.updatePaths);
	},
	updateCurrency: function (currency) {
		this.setState({	currency: currency });
	},
	updateVAT: function (vat) {
		this.setState({	vat: vat });
	},
	toggleIncludeVAT: function () {
		this.setState({ includeVAT: !this.state.includeVAT });
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
	updatePaths: function (id) {
		id = id || this.state.selected;
		var paths = this.getPaths(id, 'connects_' + this.state.direction);
		this.setState({ 
			paths: paths,
			selected: id
		});
	},
	getPaths: function (seedID, direction) {
		var _id = seedID;
		var _paths = {};

		getAllPaths();
		optimizePaths();

		return _paths;

		function getAllPaths () {
			var seed = {
				limits: [],
				total: {
					usd: 0,
					eur: 0,
					gbp: 0
				},
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
			return db[id][direction];
		}

		function addPath (parentPath, connection) {

			var isLoop = _.any(parentPath.steps, function (step) { return (connection.ship_id == step.ship_id || connection.ship_id == _id) });
			if (isLoop) { return; }

			if (connection.price['usd'] === null) { return; }

			// if limited, add to the parent's list of limited ships
			var limits = parentPath.limits.slice();
			if (db[connection.ship_id].limited) { limits.push(connection.ship_id); }

			// if it has price, increment the parent's. otherwise, null
			var total = _.mapValues(connection.price, function (price, currency) {
				return parentPath.total[currency] + price;
				//return (typeof price == 'number') ? parentPath.total[currency] + price : null;
			});


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
			// group paths by the amount of limited ships they go through
			var groupedPathsByLimitCount = _.groupBy(shipPaths, function (path) { return path.limits.length; });

			// get one optimal path per limit number
			var optimalPaths = _.map(groupedPathsByLimitCount, function (paths) { return getCheapestShortest(paths); });

			var cheapest = _.min(optimalPaths, function (path) { return path.total['usd']; });

			optimalPaths = _.chain(optimalPaths)
				.filter(function (path) { return path.limits.length <= cheapest.limits.length })
				.sortBy('total')
				.value();

			_paths[shipID] = optimalPaths;
		}

		function getCheapestShortest (paths) {

			var minPricePath = _.min(paths, function (path) { return path.total['usd']; });
			var minPrice = minPricePath.total['usd'];
			var minPricePaths = _.filter(paths, function (path) { return path.total['usd'] === minPrice; });

			var minStepsPath = _.min(minPricePaths, function (path) { return path.steps.length; });
			var minSteps = minStepsPath.steps.length;
			var minStepsPaths = _.filter(minPricePaths, function (path) { return path.steps.length === minSteps; })

			return minStepsPaths[0];
		}
	}
});

module.exports = App;