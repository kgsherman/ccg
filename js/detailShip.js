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

		var style = {};
		style.base = {
			position: 'relative',
			marginTop: this.props.index == 0 ? false : '2em',
			border: 'thin solid rgb(32, 76, 122)',
			backgroundColor: 'rgba(0, 0, 0, 0.5)'
		};
		style.header = _.extend({}, gs.linebg, {
			width: '100%',
			margin: '0',
			backgroundColor: 'rgba(30, 60, 100, 0.3)'
		});
		style.ship = {
			float: 'left',
			padding: '1em'
		};
		style.name = {
			display: 'inline-block',
			marginRight: '0.5em'
		};
		style.mfg = {
			display: 'inline-block',
			fontWeight: 'normal',
			opacity: '0.7'
		};
		style.iconsRight = {
			float: 'right'
		};
		style.iconsLeft = {
			float: 'left'
		};
		style.icon = {
			width: 42,
			height: 42
		};
		style.paths = {
			display: 'table',
			width: '100%'
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
			<div style={style.iconsRight}>
				<img src='public/warning_icon.png' style={style.icon} onMouseClick={this.showPathToolTip} onMouseOver={this.showPathToolTip} onMouseOut={this.hidePathToolTip} onMouseMove={this.updateToolTip} />
				{toolTip('Note: A cheaper path is available, but includes limited ships.\nEnable INCLUDE LIMITED PATHS in options to view.', 'right', this.state.showPathToolTip, this.hidePathToolTip)}
			</div>
			: false;

		var limitedTag = shipInfo.limited ?
			<div style={style.iconsLeft}>
				<img src='public/error_icon.png' style={style.icon} onMouseOver={this.showLimitedToolTip} onMouseOut={this.hideLimitedToolTip} onMouseMove={this.updateToolTip} />
				{toolTip('This ship is not currently for sale', 'left', this.state.showLimitedToolTip, this.hideLimitedToolTip)}
			</div>
			: false;


		return (
			<div className="detailShip" style={style.base}>
				<div style={style.header}>
					{limitedTag}
					<div style={style.ship}>
						<h2 style={style.name}>
							{db[this.props.id].display}
						</h2>
						<h4 style={style.mfg}>
							{mfgDB[db[this.props.id].mfg].name}
						</h4>
					</div>
					{multiplePaths}
					<div style={{clear: 'both'}}></div>
				</div>
				<div style={style.paths}>
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