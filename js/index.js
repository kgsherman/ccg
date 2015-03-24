/** @jsx React.DOM */

var React = require('react');
var db = require('./rsi_db.json');
var _ = require('lodash');

var Ship = React.createClass({
	render: function () {
		var data = db[this.props.shipid]
		var priceusd = (data.price.usd) ? "$" + data.price.usd : 'Not purchasable';
		var pricerec = (data.price.rec) ? '¤' + data.price.rec : "Not rentable";
		return (
			<div className="ship" onClick={this.update}>
				<h1>{data.display}</h1>
				<p>{priceusd} | {pricerec}</p>
			</div>
		);
	},
	update: function () {
		this.props.onUpdate(this.props.shipid);
	}
});

var ShipList = React.createClass({
	render: function () {
		var ships = Object.keys(db).map(function (shipid) {
			return <Ship shipid={shipid} onUpdate={this.props.onUpdate} />
		}.bind(this));
		return (
			<div className="shipList">
				{ships}
			</div>
		);
	}
});

var Details = React.createClass({
	render: function () {
		var options = "Select a ship to peruse.";
		if (this.props.data) {
			options = Object.keys(this.props.data).map(function (option) {
				return <ShipDetail id={option} data={this.props.data[option]} />
			}.bind(this));
		}
		return (
			<div className="detail">{options}</div>
		);
		
	}
});

var ShipDetail = React.createClass({
	render: function () {
		var paths = this.props.data;
		return (
			<div className="shipDetail">
				<h1>{db[this.props.id].display}</h1>
				<pre>{JSON.stringify(paths, null, '  ')}</pre>
			</div>
		);
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
				<Details data={this.state.data} />
			</div>
		);
	},
	getOptions: function (shipid) {
		var result = {};
		var iterate = function (fromID, currentPath, limits, totalCost) {
			if (!totalCost) { totalCost = 0; }
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
						if (cost < 0) {
							currentCost = "Unknown"
						} else if (totalCost != "Unknown") {
							currentCost = 0 + totalCost + cost;
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

						_.sortBy(result[toID].paths, function (path) { return totalCost; });

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

		/*for (ship in result) {
			result[ship].paths = _.reject(result[ship].paths, function (path) {
				var isCheaper = _.any(result[ship].paths, function (versus) {return (versus.totalCost < path.totalCost)})
				console.log(isCheaper);
				return isCheaper;
			});
			result[ship].paths = _.reject(result[ship].paths, function (path) {
				var isShorter = _.any(result[ship].paths, function (versus) {return (versus.path.length < path.path.length)})
				console.log(isShorter);
				return isShorter;
			});
		}*/

		this.setState({
			data: result
		});
	}
})

React.render(
  <App db={db} />,
  document.getElementById('mount')
);