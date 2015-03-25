var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var style = {
			display: this.props.show ? 'table' : 'none'
		};
		return (
			<div className="step" style={style}>
				<div className="step-price">${step.cost}</div>
				<div className="step-ship">{db[step.to].display}</div>
			</div>
		);
	}
});

module.exports = Step;