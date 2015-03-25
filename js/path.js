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
			padding: '1em 0'
		});

		var costStyle = {
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: 5,
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		};

		var countStyle = _.extend({
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxGreen);

		var limitsStyle = _.extend({
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxRed);

		var stepsStyle = {
			display: this.state.showSteps ? 'block' : 'none',
			borderTop: '1px solid rgba(29, 63, 98, 0.6)',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)',
			padding: '0.5em 0',
		};
		var fromStyle = _.merge(costStyle, gs.linebg, {
			verticalAlign: 'middle',
			marginRight: '0'
		});

		var limits = this.props.data.limits.length > 0 ? <span style={limitsStyle}>Limited by {this.props.data.limits.map(function (limit) {return db[limit].display}).join(', ')}</span> : '';

		return (
			<div style={baseStyle}>
				<div style={headerStyle} onClick={this.toggle}>
					<span style={costStyle}>${this.props.data.totalCost}</span>
					<span style={countStyle}>{this.props.data.steps.length} step(s)</span>
					{limits}
				</div>
				<div style={stepsStyle}>
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