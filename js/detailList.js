var DetailShip = require('./detailShip');
var Scroller = require('./scroller');
var Check = require('./checkbox');
var gs = require('./globalStyles');

var DetailList = React.createClass({
	getInitialState: function () {
		return {
			showSettings: false,
			showLimited: false,
			showPathLimited: false,
			sortBy: 'cost'
		}
	},
	render: function () {
		var ships = [];
		if (this.props.paths) {
			var ids = Object.keys(this.props.paths);
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
						return _.chain(this.props.paths[id])
							.map('total')
							.min()
							.value();
					}, this);
					break;
			}

			ships = ids.map(function (id, index) {
				return <DetailShip key={index} index={index} id={id} paths={this.props.paths[id]} selected={this.props.selected} includeLimited={this.state.showPathLimited} active={db[id].limited ? this.state.showLimited : true} />
			}, this);
		}

		var style = {};

		style.base = {
			position: 'absolute',
			top: 80,
			right: 0,
			bottom: 50,
			left: 340
		};
		style.header = {
			display: this.props.paths ? 'block' : 'none',
			position: 'relative',
			marginBottom: '1em',
			padding: '0.5em 0',
			borderBottom: gs.dimBorder
		};
		style.convertList = {
			position: 'absolute',
			top: 50,
			bottom: 0,
			width: '100%',
			overflow: 'auto'
		};
		style.convertContainer = {
			width: 1040
		};
		style.h1 =  {
			display: 'inline-block'
		};
		style.controls = _.extend({}, {
			display: this.state.showSettings ? 'block' : 'none',
			position: 'absolute',
			top: 0,
			right: 0,
			zIndex: 2,
			padding: '1em',
			background: 'rgba(0, 11, 24, 0.8)',
			border: '1px solid #0c67a1',
			textAlign: 'right'			
		});
		style.controlIcon = {
			display: this.state.showSettings ? 'none' : 'block',
			cursor: 'default',
			float: 'right'			
		};
		style.closeControlsArea = {
			position: 'fixed',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			zIndex: 1			
		};
		style.sortBy = _.extend({}, gs.headerFont, {
  			marginBottom: '0.5em',
			background: 'black',
			border: '1px solid #1f5b84',
			padding: '0.5em',
  			fontSize: '12px',
  			lineHeight: '16px'
		});
		style.starter = {
			position: 'absolute',
			top: '50%',
			transform: 'translateY(-50%)'			
		};

		var fromShip = this.props.paths ?
			<span>
				<span> from </span>
				<h1 style={style.h1}>{db[this.props.selected].display}</h1>
			</span>
			: false;

		var onEmpty;
		if (this.props.paths) {
			if (ships.length > 0) {
				onEmpty = ships;
			} else {
				onEmpty = 'There are no upgrades available for display. Try including limited ships and paths in OPTIONS, or the ship may not be upgradeable.';
			}
		} else {
			onEmpty = (
				<div style={style.starter}>
					<h1><i className="fa fa-caret-left"></i> Select a ship to get started</h1>
				</div>
			);
		}

		return (
			<div style={style.base}>
				<div style={style.header}>
					<h1 style={style.h1}>Possible conversions</h1>{fromShip}
					<h3 style={style.controlIcon} onMouseOver={this.showSettings} onClick={this.showSettings}> {/*duplicate events for mobile*/}
						[ <i className="fa fa-cogs"></i> Options ]
					</h3>
					{this.state.showSettings ? <div style={style.closeControlsArea} onMouseOver={this.hideSettings} onClick={this.hideSettings}></div> : false} {/*duplicate events for mobile*/}
					<div style={style.controls}>
						<div>
							<label htmlFor="sortBy">Sort by: </label>
							<select id="sortBy" defaultValue="cost" style={style.sortBy} onChange={this.resort}>
								<option value="alphabet">Alphabetical [A-Z]</option>
								<option value="mfg">Manufacturer</option>
								<option value="cost">Total cost</option>
							</select>
						</div>
						<Check id='showPathLimited' onClick={this.toggleShowPathLimited} label='Include limited paths?' />
						<Check id='showLimited' onClick={this.toggleShowLimited} label='Show limited ships?' />
					</div>
					<div style={{clear: 'both'}}></div>
				</div>
				<Scroller style={style.convertList} margin={'2em'}>
						{onEmpty}
				</Scroller>
			</div>
		);
	},
	resort: function (e) {
		this.setState({
			sortBy: e.target.value
		});
	},
	showSettings: function () {
		this.setState({
			showSettings: true
		})
	},
	hideSettings: function () {
		this.setState({
			showSettings: false
		})
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