var Chx = React.createClass({
	getInitialState: function () {
		return {
			on: this.props.startChecked
		}
	},
	render: function () {
		style = {};
		style.base = {
			display: 'inline-block',
			position: 'relative',
			margin: '0.5em',
			whiteSpace: 'pre'
		};
		style.label = {
			color: '#7696ae',
			fontWeight: 'bold',
			verticalAlign: 'middle'
		};
		style.active = {
			color: '#00f0ff',
			textShadow: '0 0 10px rgb(0, 237, 255)'
		};
		style.inactive = {
			color: '#386e91'
		};
		style.bool = {
			//fontSize: '0.75em',
			margin: '0.5em',
			verticalAlign: 'middle',
			transition: '0.2s'
		};
		style.container = {
			display: 'inline-block',
			position: 'relative',
			width: 40,
			height: 13,
			border: '1px solid #386e91',
			borderRadius: 5,
			verticalAlign: 'middle'
		};
		style.slider = {
			boxSizing: 'border-box',
			position: 'absolute',
			width: 23,
			height: 11,
			backgroundImage: 'url("public/chx-slider.png")',
			backgroundPosition: 'center center',
			backgroundRepeat: 'no-repeat',
			transition: '0.2s'
		}
		this.state.on ? style.slider.right = 0 : style.slider.right = 'calc(100% - 23px)';

		style.no = _.extend({}, style.bool, this.state.on ? style.inactive : style.active);
		style.yes = _.extend({}, style.bool, this.state.on ? style.active : style.inactive);

		style.checkbox = {
			display: 'none'
		}

		var label = this.props.label ? 
			<label htmlFor={this.props.id} style={style.label}>{this.props.label}</label>
			: false;

		return (
			<span style={{whiteSpace: 'pre'}}>
				{label}
				<div style={style.base}>
					<span style={style.no}>No</span>
					<div style={style.container}>
						<label htmlFor={this.props.id} style={style.slider}></label>
					</div>
					<span style={style.yes}>Yes</span>
					<input type="checkbox" id={this.props.id} style={style.checkbox} onClick={this.clicked} />
				</div>
			</span>
		);
	},
	clicked: function () {
		this.setState({
			on: !this.state.on
		});
		this.props.onClick();
	}
});

module.exports = Chx;