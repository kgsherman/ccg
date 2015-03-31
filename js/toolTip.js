var ToolTip = React.createClass({
	render: function () {
		var trueX = window.innerWidth - this.props.x;
		var style = {
			position: 'fixed',
			top: this.props.y + 2,
			right: trueX,
			width: this.props.width || 'auto',
			height: this.props.height || 'auto',
			background: 'rgba(0, 0, 0, 0.9)',
			padding: '0.5em'
		};
		//this.props.align == 'right' ? style.right = 'calc(100% - ' + this.props.x + ')' :  style.left = this.props.x + 2;

		return (
			<div style={style}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = ToolTip;