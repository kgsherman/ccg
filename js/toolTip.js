var ToolTip = React.createClass({
	render: function () {
		var style = {
			position: 'fixed',
			top: this.props.y + 2,
			width: this.props.width || 'auto',
			height: this.props.height || 'auto',
			transform: 'translateY(-50%)',
			background: 'rgba(0, 0, 0, 0.9)',
			padding: '0.5em',
			zIndex: '100'
		};
		this.props.align == 'right' ? 
			style.right = window.innerWidth - this.props.x + 15
			: style.left = this.props.x + 10;


		return (
			<div style={style}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = ToolTip;