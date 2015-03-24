/** @jsx React.DOM */

var React = require('react');
var db = require('./rsi_db.json');
var _ = require('lodash');

var Ship = React.createClass({
	getOptions: function () {
		var result = {};
		var iterate = function (shipid, currentpath, limits) {
			if (currentpath) { currentpath = currentpath.slice(); }
			var connections = db[shipid].connects_to;
			if (connections.length > 0) {
				connections.forEach(function (connection) {
					var id = Object.keys(connection).pop();

					//if (!result[id]) {
						result[id] = {};
						result[id].path = currentpath || [];
						result[id].path = result[id].path.slice();
						result[id].path.push({
							from: shipid,
							to: id,
							cost: connection[id]
						});
						var nextPath = result[id].path.slice();
						iterate(id, nextPath);
					//}
				});
				/*_.forEach(connections, function (connection) {
					var connectid = Object.keys(connection).pop();
					if (!result[connectid]) {
						result[connectid] = {};
						result[connectid].path = currentpath || [];
						result[connectid].path.push({
							from: shipid,
							to: connectid,
							price: connection[connectid]
						});
						var nextPath = result[connectid].path.slice();
						iterate(connectid, nextPath);
					}
				});*/
			}
		}
		iterate(this.props.shipid);
		console.log(result);



		/*var iterate = function (shipid, endpoints, pth) {
			//if (pth) result[shipid] = pth;
			//console.log(shipid, pth);
			if (pth) pth = pth.slice();
			var connections = db[shipid].connects_to;
			if (connections.length > 0) {
				_.forEach(connections, function (connection) {
					var ep = endpoints || {};
					var connectid = _.keys(connection)[0];
					if (!ep[connectid]) {
						ep[connectid] = {};
						ep[connectid].path = pth || [];
						ep[connectid].path.push({
							from: shipid,
							to: connectid,
							price: connection[connectid]
						});
						result[connectid] = ep[connectid].path.slice();
						//console.log(result[connectid]);
						iterate(connectid, ep, ep[connectid].path.slice());
					}
				});
			}			
		}
		iterate(this.props.shipid)
		console.log(result)*/


		/*var iterateOptions = function (data, ep, pth) {
			var endPoints = ep || {};
			var connections = data.connects_to;
			if (connections.length > 0) {
				_.forEach(connections, function (connection) {
					var shipid = _.keys(connection)[0];
					//path.push(connection);
					if (!endPoints[shipid]) {
						endPoints[shipid] = {};
						if (!endPoints[shipid].path) {endPoints[shipid].path = [];}
						endPoints[shipid].path.push({
							to: shipid,
							price: connection[shipid]
						});
						var shipData = db[shipid];
						iterateOptions(shipData, endPoints);
					}
				});
			}
			return endPoints;
		}

		console.log(iterateOptions(this.props.data));*/


		/*var endPoints = ep || [];
		console.log(endPoints);
		if (this.props.data.connects_to.length > 0) {
			_.forEach(this.props.data.connects_to, function (connection) {
				var path = [];
				console.log("found a connection");
				var shipid = _.keys(connection)[0];
				path.push(connection);
				newEnd = {};
				newEnd[shipid] = path;
				if (!endPoints[shipid]) {

					endPoints.push(newEnd);
					getOptions(endPoints);
					//this.getOptions(endPoints);
				}
			});
		}
		console.log("endpoints:", endPoints);*/
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