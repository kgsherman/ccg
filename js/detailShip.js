var Path = require('./path');

var DetailShip = React.createClass({
	getInitialState: function () {
		return ({
			showDetails: false
		});
	},
	render: function () {
		var paths = this.props.paths.paths;
		console.log(this.props.id);
		var style = {
			display: this.state.showDetails ? 'block' : 'none'
		};

		var json = JSON.stringify(paths, null, ' ');

		var pathNodes = _.map(paths, function (path) {
			//console.log(path);
			return <Path parentID={this.props.id} data={path} />
		}, this);

		return (
			<div className="detailShip">
				<h3 onClick={this.toggle}>{db[this.props.id].display}</h3>
				{pathNodes}
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