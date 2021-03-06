var Style = {
	linebg: {
		backgroundImage: 'url("public/line-bg.png")',
		backgroundRepeat: 'repeat'
	},
	boxGreen: {
		color: '#0f0',
		backgroundColor: 'rgba(55,158,63,0.2)',
		border: '1px solid #1f5235',
		borderRadius: '5px',
	},
	boxRed: {
		color: '#f00',
		backgroundColor: 'rgba(178,34,34,0.2)',
		border: '1px solid #502a36',
		borderRadius: '5px',
	},
	arrowRight: {
		display: 'inline-block',
		width: '58px',
		height: '58px',
		backgroundImage: 'url("public/arrow-right.png")',
		backgroundPosition: 'center center'
	},
	headerFont: {
		fontFamily: '"Electrolize", Arial, Helvetica, sans-serif',
		textTransform: 'uppercase',
		color: 'rgb(111, 216, 255)',
		textShadow: 'rgb(0, 132, 255) 0px 0px 20px'
	},
	brightBlueFont: {
		color: '#42edf8',
		textShadow: '0px 0px 30px #42a9f8'
	},
	brightRedFont: {
		color: '#f00',
		textShadow: '0px 0px 30px #b00'
	},
	dimBorder: '1px solid rgba(29, 63, 98, 0.9)',
	xdimBorder: '1px solid rgba(22 , 42, 63, 0.8)',
	blueFont: {
		color: 'rgb(111, 216, 255)'
	}
};

Style.selectBox = _.extend({}, Style.headerFont, {
	background: 'black',
	border: '1px solid #1f5b84',
	padding: '0.5em',
	fontSize: '12px',
	lineHeight: '16px'
});

module.exports = Style;