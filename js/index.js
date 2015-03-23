/** @jsx React.DOM */

var React = require('react');
var db = require('./rsi_db.json');
var _ = require('lodash');

var Ship = React.createClass({
	render: function () {
		return (
			<div className="ship">
				<h1>{this.props.data.display}</h1>
				${this.props.data.price.usd} | REC {this.props.data.price.rec}
			</div>
		);
	}
});

var App = React.createClass({
	render: function () {
		var shipNodes = _(this.props.db).values(function (ship) {
			return (
				helllo
			);
		});
		return (
			<div className="list">
				{shipNodes}
			</div>
		);
	}
})

React.render(
  <App db={db} />,
  document.getElementById('mount')
);