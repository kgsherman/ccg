var Path = require('./path');
var gs = require('./globalStyles');

var DetailShip = React.createClass({
	render: function () {
		var paths = this.props.paths.paths;

		var pathNodes = _.map(paths, function (path) {
			return <Path parentID={this.props.id} data={path} selected={this.props.selected} />
		}, this);

		var baseStyle = _.extend({}, {
			position: 'relative',
			border: 'thin solid rgb(32, 76, 122)',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			marginBottom: '1em'
		});

		var headerStyle = _.extend({}, gs.linebg, {
			width: '100%',
			backgroundColor: 'rgba(30, 60, 100, 0.3)',
			padding: '1em',
			margin: '0'
		});

		return (
			<div className="detailShip" style={baseStyle}>
				<h3 className="line-bg" style={headerStyle}>{db[this.props.id].display}</h3>
				{pathNodes}
			</div>
		);
	},
});

module.exports = DetailShip;