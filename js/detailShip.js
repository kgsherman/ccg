var Path = require('./path');

var DetailShip = React.createClass({
	render: function () {
		var paths = this.props.paths.paths;

		var pathNodes = _.map(paths, function (path) {
			return <Path parentID={this.props.id} data={path} selected={this.props.selected} />
		}, this);

		var headerStyle = {
			width: '250px',
			backgroundColor: 'rgba(30, 60, 100, 0.3)',
			padding: '1em',
			margin: '0 1em'
		};

		return (
			<div className="detailShip">
				<h3 className="line-bg" style={headerStyle}>{db[this.props.id].display}</h3>
				{pathNodes}
			</div>
		);
	},
});

module.exports = DetailShip;