var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var style = {
			display: this.props.show ? 'table' : 'none'
		};
		return (
			<div className="step" style={style}>
				<div className="step-price">${step.cost}</div>
				<div className="step-ships">
					<div className="step-from">{db[step.from].display}</div>
					<div className="step-to">{db[step.to].display}</div>
				</div>
				<div style={{clear: 'both'}}></div>
			</div>
		);
	}
});

module.exports = Step;