/* 
 * totally unnecessary for the footer to be a react class, but doing it as such right now for future proofing.
 * If this never actually ends up using react, should convert it to plain html.
 */

var style = {
	base: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		textAlign: 'center',
		lineHeight: '14px',
		opacity: '0.5'
	}
};

var Footer = React.createClass({
	render: function () {
		return (
			<div style={style.base}>
				<p>
					RSI_DB is a fan-made tool completely unaffiliated with Star Citizen, Roberts Space Industries, or Clould Imperium Games.<br />
					All styles and assets that are originally from robertsspaceindustries.com have been reused without permission.
				</p>
			</div>
		);
	}
});

module.exports = Footer;