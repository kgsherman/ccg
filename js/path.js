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


		var baseStyle = _.extend({}, gs.linebg, {
			display: 'table-row',
			width: '100%',
			borderTop: 'rgb(32, 76, 122)',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)',
			padding: '0'
		});

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
			whiteSpace: 'nowrap',
			color: 'white'
		};

		var costStyle = _.extend({
			padding: '0.5em 1em',
			margin: '0.5em 1em'
		}, gs.boxGreen);

		var limitsStyle = _.extend({
			padding: '0.5em 1em',
			margin: '1em 1em 0.5em 1em',
			whiteSpace: 'pre'
		}, gs.boxRed);

		var stepsStyle = {
			display: this.state.showSteps ? 'block' : 'none',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)'
		};
		var fromStyle = _.extend({}, gs.headerFont, gs.brightBlueFont, {
			display: 'inline-block',
			backgroundColor: 'rgba(30, 60, 100, 0.3)',
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

		var cellStyle = {
			display: 'table-cell',
			borderBottom: '1px solid rgba(29, 63, 98, 0.6)'
		};

		var fitCellStyle = _.extend({}, cellStyle, {
			width: 1
		});

		var stepsNewStyle = _.extend({}, cellStyle, {
			borderLeft: '1px solid rgba(29, 63, 98, 0.9)',
			borderRight: '1px solid rgba(29, 63, 98, 0.9)',
			padding: '0.5em 1em'
		});

		var limits = this.props.data.limits.length > 0 ?
			<div style={limitsStyle}>
				<span style={limitsSoft}>Limited by</span> {this.props.data.limits.map(function (limit) {return db[limit].display}).join(',\r\n')}
			</div> 
			: false;

		return (
			<div style={baseStyle} className="path-base">
				<div style={fitCellStyle}>
					<div style={{textAlign: 'center'}}>
						<span style={costStyle}>${this.props.data.totalCost}</span>
						<span style={countStyle}>{this.props.data.steps.length} step{this.props.data.steps.length == 1 ? '' : 's'}</span>
					</div>
					{/* limits */}
				</div>
				<div style={stepsNewStyle}>
					<div style={fromStyle}>{db[this.props.selected].display}</div>
					{steps}
				</div>
			</div>
		);
	},
	toggle: function (e) {
		e.preventDefault();
		this.setState({ showSteps: !this.state.showSteps });
	},
	keepold: function () {
		return
		<div>
		 				<div style={stepsStyle} className="path-steps-container">
					<span style={fromStyle}>{db[this.props.selected].display}</span>
					{steps}
				</div>


									<div style={{display: 'table-cell', width: 1}}>
						<div style={expanderStyle}>[{this.state.showSteps ? '-' : '+'}]</div>
					</div>
				</div>
	}
});

module.exports = Path;