var gs = require('./globalStyles');

var Step = React.createClass({
	render: function () {
		var step = this.props.data;
		var style = {
			display: this.props.show ? 'inline-block' : 'none'
		};
		var priceContainerStyle = _.merge({
			
		}, gs.arrowRight);
		return (
			<div className="step" style={style}>
				<span className="step-price" style={priceContainerStyle}>
					<span style={gs.linebg}>${step.cost}</span>
				</span>
				<span className="step-ship">{db[step.to].display}</span>
			</div>
		);
	}
});

module.exports = Step;