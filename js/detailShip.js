var Path = require('./path');
var gs = require('./globalStyles');
var mfgDB = require('./db/mfg.json');
var ToolTip = require('./toolTip');

var DetailShip = React.createClass({
	getInitialState: function () {
		return { 
			showAll: false,
			hover: false,
			showPathToolTip: false,
			showLimitedToolTip: false,
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
			margin: '0'
		});

		var nameStyle = {
			padding: '1em',
			float: 'left'
		};

		var mfgStyle = {
			display: 'inline-block',
			fontWeight: 'normal',
			opacity: '0.7'
		};

		var h2Style = {
			display: 'inline-block',
			marginRight: '0.5em'
		};

		var iconContainerRight = {
			float: 'right'
		};
		var iconContainerLeft = {
			float: 'left'
		};

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

		var iconStyle = {
			width: 42,
			height: 42
		};

		var toolTip = function (text, align, showCondition, hideFunction) {
			if (!showCondition) return false;
			return (
				<ToolTip align={align} x={this.state.toolTipX} y={this.state.toolTipY} onClick={hideFunction}>
					{text}
				</ToolTip> 
			);
		}.bind(this);

		var multiplePaths = pathsCount > 1 && !this.props.includeLimited ?
			<div style={iconContainerRight}>
				<img src='public/warning_icon.png' style={iconStyle} onMouseClick={this.showPathToolTip} onMouseOver={this.showPathToolTip} onMouseOut={this.hidePathToolTip} onMouseMove={this.updateToolTip} />
				{toolTip('Note: A cheaper path is available, but includes limited ships.\nEnable INCLUDE LIMITED PATHS in options to view.', 'right', this.state.showPathToolTip, this.hidePathToolTip)}
			</div>
			: false;

		var limitedTag = shipInfo.limited ?
			<div style={iconContainerLeft}>
				<img src='public/error_icon.png' style={iconStyle} onMouseOver={this.showLimitedToolTip} onMouseOut={this.hideLimitedToolTip} onMouseMove={this.updateToolTip} />
				{toolTip('This ship is not currently for sale', 'left', this.state.showLimitedToolTip, this.hideLimitedToolTip)}
			</div>
			: false;


		return (
			<div className="detailShip" style={baseStyle}>
				<div style={headerStyle}>
					{limitedTag}
					<div style={nameStyle}>
						<h2 style={h2Style}>
							{db[this.props.id].display}
						</h2>
						<h4 style={mfgStyle}>
							{mfgDB[db[this.props.id].mfg].name}
						</h4>
					</div>
					{multiplePaths}
					<div style={{clear: 'both'}}></div>
				</div>
				<div style={pathContainerStyle}>
					{pathNodes}
				</div>
			</div>
		);
	},
	showPathToolTip: function (e) {
		this.setState({ showPathToolTip: true });
	},
	hidePathToolTip: function () {
		this.setState({ showPathToolTip: false });
	},
	showLimitedToolTip: function () {
		this.setState({ showLimitedToolTip: true });
	},
	hideLimitedToolTip: function () {
		this.setState({ showLimitedToolTip: false });
	},
	updateToolTip: function (e) {
		this.setState({ toolTipX: e.clientX, toolTipY: e.clientY });
	}
});

module.exports = DetailShip;