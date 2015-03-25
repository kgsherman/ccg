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

		return (
			<div className={classes}>
				<div className="path-header" onClick={this.toggle}>
					<p>Total cost: {this.props.data.totalCost}</p>
					<p>Conversions: {this.props.data.steps.length}</p>
					{limits}
				</div>
				<div className="step" style={{display: this.state.showSteps ? 'block' : 'none'}}>
					<div className="step-ship">{db[this.props.selected].display}</div>
				</div>
				{steps}
			</div>
		);
	},
	toggle: function () {
		this.setState({ showSteps: !this.state.showSteps });
	}
});

module.exports = Path;