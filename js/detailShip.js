var Path = require('./path');
var gs = require('./globalStyles');
var mfgDB = require('./db/mfg.json');
var ToolTip = require('./toolTip');

var DetailShip = React.createClass({
	getInitialState: function () {
		return { 
			showAll: false,
			hover: false,
			showToolTip: false,
			toolTipX: 0,
			toolTipY: 0
		};
	},
	render: function () {
		var paths = this.props.paths.paths;
		var pathsCount = paths.length;
		var shipInfo = db[this.props.id];

		var pathNodes = _.chain(paths)
			.filter(function (path) {
				if (!this.props.includeLimited && path.limits.length > 0 && !(db[this.props.id].limited && path.limits.length == 1)) return false;
				else return true;
			}, this)
			.map(function (path, index) {
				var key = this.props.selected + '_' + this.props.id + index; // generate unique and descriptive key
				return (
					<Path 
						key={key} 
						parentID={this.props.id} 
						data={path} 
						selected={this.props.selected}
						showAtStart={pathsCount == 1}
						showAll={this.state.showAll} 
					/>
				);
			}, this)
			.value();

		var baseStyle = _.extend({}, {
			position: 'relative',
			width: 1020,
			border: 'thin solid rgb(32, 76, 122)',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			marginBottom: '2em'
		});

		var headerStyle = _.extend({}, gs.linebg, {
			width: '100%',
			backgroundColor: 'rgba(30, 60, 100, 0.3)',
			padding: '1em',
			margin: '0'
		});

		var mfgStyle = {
			display: 'inline-block',
			fontWeight: 'normal',
			opacity: '0.7'
		};

		var h2Style = {
			display: 'inline-block',
			marginRight: '0.5em'
		};

		var multiplePathsStyle = {
			position: 'absolute',
			top: 0,
			right: 0
		}

		var h4Style = {
			display: 'inline-block',
			fontWeight: 'normal',
			marginRight: '0.5em'
		};

		var expanderStyle = {
			fontSize: '0.8em',
			opacity: this.state.hover ? '1' : '0.7',
			color: this.state.hover ? 'rgb(111, 216, 255)' : 'white',
			textDecoration: this.state.hover ? 'underline' : 'none',
		};

		var limitedTagStyle = _.extend({}, gs.boxRed, {
			color: '#b00',
			padding: '0.25em 0.5em',
			margin: '0.5em 1em',
			verticalAlign: 'baseline'
		});

		var pathContainerStyle = {
			display: 'table',
			width: '100%'
		};

		var errorIconStyle = {
			width: 45,
			height: 45
		};

		var toolTip = (this.state.showToolTip) ? 
			<ToolTip align='right' x={this.state.toolTipX} y={this.state.toolTipY}>
				Note: A cheaper path is available, but includes limited ships.
			</ToolTip> 
			: false;
		var multiplePaths = pathsCount > 1 && !this.props.includeLimited ?
			<div className="multiplePaths" style={multiplePathsStyle}>
				<img src='public/error_icon.png' style={errorIconStyle} onMouseOver={this.showToolTip} onMouseOut={this.hideToolTip} onMouseMove={this.updateToolTip} />
				{toolTip}
			</div>
			: false;

		var limitedTag = shipInfo.limited ?
			<span style={limitedTagStyle}>
				Not currently for sale
			</span>
			: false;


		return (
			<div className="detailShip" style={baseStyle}>
				<div style={headerStyle} onClick={pathsCount > 1 ? this.showAll : false} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
					<h2 style={h2Style}>
						{db[this.props.id].display}
					</h2>
					<h4 style={mfgStyle}>
						{mfgDB[db[this.props.id].mfg].name}
					</h4>
					{limitedTag}
					{multiplePaths}
				</div>
				<div style={pathContainerStyle}>
					{pathNodes}
				</div>
			</div>
		);
	},
	mouseOver: function () {
		this.setState({ hover: true });
	},
	mouseOut: function () {
		this.setState({ hover: false });
	},
	showAll: function () {
		this.setState({
			showAll: this.state.showAll + 1 // use incremental so that children can check to see if the incoming props are different than current
		})
	},
	showToolTip: function () {
		this.setState({ showToolTip: true });
	},
	hideToolTip: function () {
		this.setState({ showToolTip: false });
	},
	updateToolTip: function (e) {
		this.setState({ toolTipX: e.clientX, toolTipY: e.clientY });
	}
});

module.exports = DetailShip;