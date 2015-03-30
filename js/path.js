var Step = require('./step');
var gs = require('./globalStyles');

var Path = React.createClass({
	getInitialState: function () {
		return ({
			showSteps: this.props.showAtStart
		});
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.showAll == this.props.showAll) return;
		this.setState({
			showSteps: true
		});
	},
	render: function () {

		var steps = this.props.data.steps.map(function (step, index) {
			return <Step key={index} data={step} show={true} />
		}, this);


		var baseStyle = {
			display: 'table',
			width: '100%',
			borderTop: 'rgb(32, 76, 122)',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)',
			padding: '0'
		};

		var headerStyle = _.extend({}, gs.linebg, {
			display: 'table-row',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)',
			cursor: 'pointer'
		});

		var countStyle = {
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: 5,
			padding: '0.5em 1em',
			margin: '0.5em 1em 0.5em 0',
			whiteSpace: 'nowrap'
		};

		var costStyle = _.extend({
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxGreen);

		var limitsStyle = _.extend({
			padding: '0.5em 1em',
			margin: '0.5em 1em',
			whiteSpace: 'nowrap'
		}, gs.boxRed);

		var stepsStyle = {
			display: this.state.showSteps ? 'block' : 'none',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)'
		};
		var fromStyle = _.extend({}, gs.linebg, {
			textShadow: 'rgb(0, 132, 255) 0px 0px 20px',
			border: '1px solid rgba(29, 63, 98, 0.9)',
			borderRadius: 5,
			padding: '0.5em 1em'
		});
		var limitsSoft = {
			color: '#b00'
		};
		var expanderStyle = {
			fontFamily: 'monospace',
			margin: '0.5em',
			padding: '0.5em',
		};

		var stepsNewStyle = {
			display: 'table-cell',
			borderLeft: '1px solid rgba(29, 63, 98, 0.9)',
			borderRight: '1px solid rgba(29, 63, 98, 0.9)',
			padding: '0.5em'
		};

		var limits = this.props.data.limits.length > 0 ?
			<div style={{display: 'table-cell', width: 1, borderRight: '1px solid rgba(29, 63, 98, 0.9)'}}>
				<div style={limitsStyle}>
					<span style={limitsSoft}>Limited by</span> {this.props.data.limits.map(function (limit) {return db[limit].display}).join(', ')}
				</div> 
			</div> 
			: false;

		return (
			<div style={baseStyle} className="path-base">
				<div style={headerStyle} onClick={this.toggle} className="path-header">
					<div style={{display: 'table-cell', width: 1}}>
						<div style={costStyle}>${this.props.data.totalCost}</div>
					</div>
					<div style={{display: 'table-cell', width: 1}}>
						<div style={countStyle}>{this.props.data.steps.length} step{this.props.data.steps.length == 1 ? '' : 's'}</div>
					</div>
					<div style={stepsNewStyle}>
						<span style={fromStyle}>{db[this.props.selected].display}</span>
						{steps}
					</div>
					{limits}
					<div style={{display: 'table-cell', width: 1}}>
						<div style={expanderStyle}>[{this.state.showSteps ? '-' : '+'}]</div>
					</div>
				</div>
			</div>
		);
	},
	toggle: function (e) {
		e.preventDefault();
		this.setState({ showSteps: !this.state.showSteps });
	},
	keepold: function () {
		return 				<div style={stepsStyle} className="path-steps-container">
					<span style={fromStyle}>{db[this.props.selected].display}</span>
					{steps}
				</div>
	}
});

module.exports = Path;