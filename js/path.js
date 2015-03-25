var Step = require('./step');
//var addons = require('react-addons');

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

		var limits = this.props.data.limits.length > +parent.limited ? <span>Limited by: {this.props.data.limits.map(function (limit) {return db[limit].display}).join(', ')}</span> : '';

		var baseStyle = {
			borderTop: '1px solid rgba(29, 63, 98, 0.6)',
			padding: '0'
		}

		var headerStyle = {
			margin: '1em 0'
		};

		var costStyle = {
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			//boxShadow: '0 0 5px rgba(159, 227, 246, 0.5), inset 0 0 8px rgba(159, 227, 246, 0.4)',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		};

		var countStyle = {};
		var stepsStyle = {
			display: this.state.showSteps ? 'block' : 'none',
			padding: '0.5em'
		};
		var fromStyle = {

		};

		return (
			<div style={baseStyle} onClick={this.toggle}>
				<div style={headerStyle}>
					<span style={costStyle}>${this.props.data.totalCost}</span>
					<span style={countStyle}>{this.props.data.steps.length} step(s)</span>
					{limits}
				</div>
				<div style={stepsStyle}>
					<div style={fromStyle}>Convert from {db[this.props.selected].display} to:</div>
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