/* 
 * totally unnecessary for the footer to be a react class, but doing it as such right now for future proofing.
 * If this never actually ends up using react, should convert it to plain html.
 */

var style = {
	base: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		padding: '0.5em 0',
		margin: '1em 0 0 0',
		textAlign: 'center',
		lineHeight: '14px',
		opacity: '0.5',
		borderTop: '1px solid rgba(29, 63, 98, 0.9)'
	}
};

var Footer = React.createClass({
	render: function () {
		return (
			<div style={style.base}>
				<p style={{padding: 0, margin: 0}}>
					RSI_DB is a fan-made tool 100% unaffiliated with Star Citizen, Roberts Space Industries, or Clould Imperium Games.<br />
					All styles and assets that are originally from robertsspaceindustries.com have been reused without permission.
				</p>
			</div>
		);
	}
});

module.exports = Footer;