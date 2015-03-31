var DetailShip = require('./detailShip');
var gs = require('./globalStyles');

var DetailList = React.createClass({
	getInitialState: function () {
		return {
			showLimited: false,
			showPathLimited: false,
			sortBy: 'cost'
		}
	},
	render: function () {
		var ships = [];
		if (this.props.paths) {
			var ids = Object.keys(this.props.paths);
			ids = _.filter(ids, function (id) {
				return db[id].limited <= this.state.showLimited
			}.bind(this));
			switch (this.state.sortBy) {
				case 'alphabet':
					ids = _.sortBy(ids, function (id) { return db[id].display });
					break;
				case 'mfg':
					ids = _.chain(ids)
						.sortBy(function (id) { return db[id].display })
						.sortBy(function (id) { return db[id].mfg })
						.value();
					break;
				case 'cost':
					ids = _.sortBy(ids, function (id) {
						return _.chain(this.props.paths[id].paths)
							.map('totalCost')
							.min()
							.value();
					}, this);
					break;
			}

			ships = ids.map(function (id, index) {
				return <DetailShip key={index} id={id} paths={this.props.paths[id]} selected={this.props.selected} includeLimited={this.state.showPathLimited} />
			}, this);
		}

		var baseStyle = {
			position: 'absolute',
			left: 307,
			right: 0,
			bottom: 50,
			top: 80
		};

		var headerStyle = {
			width: 1020,
			margin: '0 0 1em 12px',
			padding: '0.5em 0',
			borderBottom: '1px solid rgba(29, 63, 98, 0.9)'
		};

		var detailListStyle = {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			top: 90,
			padding: '0 1em',
			overflow: 'auto'
		};

		var h1Style = {
			display: 'inline-block'
		};

		var showLimitedStyle = _.extend({}, gs.headerFont, {

		});

		var controlsStyle = {
			float: 'right',
			textAlign: 'right'
		};

		var sortByStyle = _.extend({}, gs.headerFont, {
			background: 'black',
			border: '1px solid #1f5b84',
			padding: '0.5em',
  			fontSize: '12px',
  			lineHeight: '16px'
		});

		var fromShip = this.props.paths ?
			<span>
				<span> from </span>
				<h1 style={h1Style}>{db[this.props.selected].display}</h1>
			</span>
			: false;

		var onEmpty = this.props.paths ?
			ships.length > 0 ?
				ships
				: 'No conversions match your criteria. Try changing the filter using the checkboxes above.'
			: 'Select a ship on the left to begin.'

		return (
			<div style={baseStyle}>
				<div style={headerStyle}>
					<h1 style={h1Style}>Possible conversions</h1>{fromShip}
					<div style={controlsStyle}>
						<div>
							<label htmlFor="sortBy" style={showLimitedStyle}>Sort by: </label>
							<select id="sortBy" style={sortByStyle} onChange={this.resort}>
								<option value="alphabet">Alphabetical [A-Z]</option>
								<option value="mfg">Manufacturer</option>
								<option value="cost" selected="selected">Total cost</option>
							</select>
						</div>
						<div style={showLimitedStyle}>
							<label htmlFor="showPathLimited" style={{verticalAlign: 'middle'}}>Include limited paths:</label>
							<input type="checkbox" id="showPathLimited" onClick={this.toggleShowPathLimited} style={{verticalAlign: 'middle'}} />
						</div>
						<div style={showLimitedStyle}>
							<label htmlFor="showLimited" style={{verticalAlign: 'middle'}}>Show limited ships:</label>
							<input type="checkbox" id="showLimited" onClick={this.toggleShowLimited} style={{verticalAlign: 'middle'}} />
						</div>
					</div>
					<div style={{clear: 'both'}}></div>
				</div>
				<div className="detailList" style={detailListStyle}>
					{onEmpty}
				</div>
			</div>
		);
	},
	resort: function (e) {
		this.setState({
			sortBy: e.target.value
		});
	},
	toggleShowLimited: function () {
		this.setState({
			showLimited: !this.state.showLimited
		});
	},
	toggleShowPathLimited: function () {
		this.setState({
			showPathLimited: !this.state.showPathLimited
		});
	}
});

module.exports = DetailList;