/** @jsx React.DOM */

var React = require('react');
var db = require('./rsi_db.json');
var _ = require('lodash');

var Ship = React.createClass({
	getOptions: function () {
		var result = {};
		var iterate = function (fromID, currentPath, limits) {
			if (currentPath) { currentPath = currentPath.slice(); } // make sure we're getting values, not references
			if (limits) { limits = limits.slice(); }
			var connections = db[fromID].connects_to;
			if (connections.length > 0) {
				connections.forEach(function (connection) {
					var toID = Object.keys(connection).pop();
					var cost = connection[toID];
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
						path: newPath
					});


					var nextPath = newPath.slice();
					var nextLimits = currentLimits.slice();
					iterate(toID, nextPath, nextLimits);
				});
			}
		}

		iterate(this.props.shipid);
		console.log(result);

	},
	render: function () {
		var data = db[this.props.shipid]
		var priceusd = (data.price.usd) ? "$" + data.price.usd : 'Not purchasable';
		var pricerec = (data.price.rec) ? '¤' + data.price.rec : "Not rentable";
		return (
			<div className="ship" onClick={this.getOptions}>
				<h1>{data.display}</h1>
				<p>{priceusd} | {pricerec}</p>
			</div>
		);
	}
});

var App = React.createClass({
	render: function () {
		var ships = [];
		for (var shipid in db) {
			ships.push(<Ship shipid={shipid} />);
		}
		return (
			<div className="list">
				{ships}
			</div>
		);
	}
})

React.render(
  <App db={db} />,
  document.getElementById('mount')
);