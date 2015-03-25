var Step = require('./step');
var gs = require('./globalStyles');

var Path = React.createClass({
	getInitialState: function () {
		return ({
			showSteps: false
		});
	},
	render: function () {
		var parent = db[this.props.parentID]
		var parentLimited = +parent.limited
		var cx = React.addons.classSet;
		var classes = cx({
			'path': true,
			'path-limited': this.props.data.limits.length > parentLimited
		});

		var steps = this.props.data.steps.map(function (step) {
			return <Step data={step} show={this.state.showSteps} />
		}, this);


		var baseStyle = {
			borderTop: 'rgb(32, 76, 122)',
			padding: '0'
		}

		var headerStyle = _.extend({}, gs.linebg, {
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)'
		});

		var countStyle = {
			float: 'left',
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: 5,
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		};

		var costStyle = _.extend({
			float: 'left',
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxGreen);

		var limitsStyle = _.extend({
			float: 'right',
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxRed);

		var stepsStyle = {
			display: this.state.showSteps ? 'block' : 'none',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)',
			padding: '0.5em 0',
		};
		var fromStyle = _.extend({}, gs.linebg, {
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: 5,
			padding: '0.5em 1em',
			margin: '0.5em 1em',
			verticalAlign: 'middle',
			marginRight: '0'
		});
		var limitsSoft = {
			color: '#b00'
		};

		var limits = this.props.data.limits.length > 0 ? <div style={limitsStyle}><span style={limitsSoft}>Limited by</span> {this.props.data.limits.map(function (limit) {return db[limit].display}).join(', ')}</div> : '';

		return (
			<div style={baseStyle} className="path-base">
				<div style={headerStyle} onClick={this.toggle} className="path-header">
					<div style={costStyle}>${this.props.data.totalCost}</div>
					<div style={countStyle}>{this.props.data.steps.length} step{this.props.data.steps.length == 1 ? '' : 's'}</div>
					{limits}
					<div style={{clear: 'both'}}></div>
				</div>
				<div style={stepsStyle} className="path-steps-container">
					<span style={fromStyle}>{db[this.props.selected].display}</span>
					{steps}
				</div>
			</div>
		);
	},
	toggle: function () {
		this.setState({ showSteps: !this.state.showSteps });
	}
});

module.exports = Path;