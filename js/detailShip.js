var DetailShip = React.createClass({
	getInitialState: function () {
		return ({
			showDetails: false
		});
	},
	render: function () {
		var paths = this.props.paths;
		var style = {
			display: this.state.showDetails ? 'block' : 'none'
		};

		var json = JSON.stringify(paths, null, ' ');

		return (
			<div className="detailShip">
				<h1 onClick={this.toggle}>{db[this.props.id].display}</h1>
				<pre style={style}>
					{json}
				</pre>
			</div>
		);
	},
	toggle: function () {
		this.setState({
			showDetails: !this.state.showDetails
		});
	}
});

module.exports = DetailShip;