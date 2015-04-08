var VATdb = require('./db/vat.json');
var gs = require('./globalStyles');
var Check = require('./checkbox');

var Local = React.createClass({
	getInitialState: function () {
		return {
			currency: 'usd',
			vat: 0,
			includeVAT: true
		};
	},
	componentWillMount: function () {
		this.positions = {};
	},
	componentDidMount: function () {
		this.positions.eur = React.findDOMNode(this.refs.eur).offsetLeft;
		this.positions.gbp = React.findDOMNode(this.refs.gbp).offsetLeft;
		this.positions.usd = React.findDOMNode(this.refs.usd).offsetLeft;
		this.forceUpdate();
	},
	render: function () {
		var style = {};
		style.base = {
			position: 'absolute',
			right: 0,
			top: 0,
			height: '100%',
		};
		style.countryContainer = {
			height: 32,
			lineHeight: '32px',
			textAlign: 'right'
		};
		style.icon = {
			position: 'relative',
			zIndex: 1,
			float: 'right',
			width: 16,
			height: 11,
			marginRight: '0.5em',
			cursor: 'pointer'
		};
		style.selector = {
			position: 'absolute',
			bottom: '100%',
			width: 24,
			height: 24,
			margin: '-6px -12px',
			backgroundImage: 'url("public/arrow-down.png")',
			backgroundSize: '24px 24px',
			transition: '0.2s'
		};
		style.selector.left = this.positions[this.state.currency] + 8;

		style.country = _.extend({}, gs.selectBox, {
			display: this.state.currency == 'eur' ? 'inline-block' : 'none',
			padding: '2px',
			marginRight: '0.5em',
			verticalAlign: 'middle'
		});
		style.currentVAT = _.extend({}, gs.headerFont, {
			display: this.state.vat > 0 && this.state.includeVAT ? 'inline-block' : 'none',
			margin: '0 0.5em',
			verticalAlign: 'middle',
			transition: '0.2s'
		});
		style.includeVAT = {
			opacity: this.state.vat > 0 ? '1' : '0',
			transition: '0.2s'
		};

		style.iconContainer = {
			position: 'relative',
			display: 'inline-block',
			verticalAlign: 'middle'
		};

		style.eur = _.extend({}, style.icon, {
			backgroundImage: 'url("public/eu-icon.png")'
		});
		style.gbp = _.extend({}, style.icon, {
			backgroundImage: 'url("public/uk-icon.png")'
		});
		style.usd = _.extend({}, style.icon, {
			backgroundImage: 'url("public/us-icon.png")'
		});


		var countries = _.map(VATdb, function (value, key) {
			var country = key;
			var vat = value;
			return (
				<option value={country} vat={vat}>{country}</option>
			);
		});
		return (
			<div style={style.base}>
				<div style={style.countryContainer}>
					<select ref='countries' style={style.country} onChange={this.selectVAT}>
						{countries}
					</select>
					<div style={style.iconContainer}>
						<div style={style.selector}></div>
						<div ref="usd" style={style.usd} onClick={this.selectUSD}></div>
						<div ref="gbp" style={style.gbp} onClick={this.selectGBP}></div>
						<div ref="eur" style={style.eur} onClick={this.selectEUR}></div>
						<div style={{clear: 'both'}}></div>
					</div>
				</div>
				<div style={style.includeVAT}>
					<Check id='includeVAT' startChecked={true} onClick={this.toggleIncludeVAT} label={'Include VAT (' + this.state.vat + '%) in prices?'} />
				</div>
			</div>
		);
	},
	toggleIncludeVAT: function () {
		this.setState({ includeVAT: !this.state.includeVAT });
		this.props.onToggleIncludeVAT();
	},
	selectEUR: function () {
		this.setState({
			currency: 'eur',
			vat: VATdb[React.findDOMNode(this.refs.countries).value]
		}, function () {
			this.pushCurrency().pushVAT();
		});
	},
	selectGBP: function () {
		this.setState({
			currency: 'gbp',
			vat: VATdb['United Kingdom']
		}, function () {
			this.pushCurrency().pushVAT();
		});
	},
	selectUSD: function () {
		this.setState({
			currency: 'usd',
			vat: 0
		}, function () {
			this.pushCurrency().pushVAT();
		});
	},
	selectVAT: function (e) {
		if (e.target.value == 'United Kingdom') {
			e.target.value = 'NON-EU'; // reset select
			this.selectGBP();
			return;
		}
		this.setState({
			vat: VATdb[e.target.value]
		}, function () {
			this.pushVAT();
		});
	},
	pushCurrency: function () {
		this.props.onChangeCurrency(this.state.currency);
		return this;
	},
	pushVAT: function () {
		this.props.onChangeVAT(this.state.vat);
		return this;
	}
});

module.exports = Local;