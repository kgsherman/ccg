var Step = require('./step');
//var addons = require('react-addons');

var Path = React.createClass({
	getInitialState: function () {
		return ({
			showSteps: false
		});
	},
	render: function () {
		var parentLimited = +db[this.props.parentID].limited
		var cx = React.addons.classSet;
		var classes = cx({
			'path': true,
			'path-limited': this.props.data.limits.length > parentLimited
		});

		var steps = this.props.data.steps.map(function (step) {
			return <Step data={step} show={this.state.showSteps} />
		}, this);

		return (
			<div className={classes}>
				<p onClick={this.toggle}>Total cost: {this.props.data.totalCost}</p>
				{steps}
			</div>
		);
	},
	toggle: function () {
		this.setState({ showSteps: !this.state.showSteps });
	}
});

module.exports = Path;