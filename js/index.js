/** @jsx React.DOM */

var React = require('react');
var db = require('./rsi_db.json');
var _ = require('lodash');

var Ship = React.createClass({
	render: function () {
		console.log(this.props.data);
		var name = this.props.data.display;
		var priceusd = (this.props.data.price && this.props.data.price.usd) ? this.props.data.price.usd : 'Not available';
		return (
			<div className="ship">
				<h1>{this.props.data.display}</h1>
				${this.props.data.price.usd} | {this.props.data.price.rec} REC
			</div>
		);
	}
});

var App = React.createClass({
	render: function () {
		var ships = [];
		for (var ship in db) {
			ships.push(<Ship data={db[ship]} />);
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