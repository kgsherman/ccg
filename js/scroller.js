var Scroller = React.createClass({
	drawScroller: function () {

		var canvas = React.findDOMNode(this.refs.scrollCanvas);
		var container = React.findDOMNode(this.refs.scrollContainer);
		
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight + 1;

		var ctx = canvas.getContext('2d');

		var children = React.Children.count(this.refs.content.props.children);
		var interval = container.clientHeight / children;

		ctx.beginPath();
		ctx.strokeStyle = 'rgba(13, 117, 177, 0.5)';
		ctx.lineWidth = 3,
		ctx.moveTo(canvas.width - 1.5, 0);
		ctx.lineTo(canvas.width - 1.5, canvas.height);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'rgba(38, 94, 160, 0.33)';
		ctx.lineWidth = 1;
		ctx.moveTo(0, 0);
		ctx.lineTo(0.5, container.clientHeight + 1);
		ctx.stroke();


		for (var i = 0; i <= children; i++) {
			var y = Math.floor(interval * i) + 0.5;
			
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(38, 94, 160, 0.33)';
			ctx.moveTo(1, y);
			ctx.lineTo(14, y);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = '#1dd3ff';
			ctx.moveTo(14, y);
			ctx.lineTo(16, y);
			ctx.stroke();

			for (var n = 1; n < 4; n++) {
				var _y = y + n * (interval / 4);
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(38, 94, 160, 0.33)';
				ctx.moveTo(1, _y);
				ctx.lineTo(9, _y);
				ctx.stroke();
			}
		}
	},
	getInitialState: function () {
		return {
			position: 0,
			showScroller: true,
			glow: false
		};
	},
	componentDidMount: function () {
		this.isScrolling = false;
		if (this.checkShowScroller()) { 
			this.syncScroller(); 
			this.drawScroller();
		}
		window.addEventListener('resize', this.checkShowScroller);
	},
	componentDidUpdate: function (prevProps, prevState) {
		if (React.Children.count(prevProps.children) !== React.Children.count(this.props.children)) {
			if (this.checkShowScroller()) { 
				this.drawScroller();
				this.content.scrollTop = 0;  
			}
		}
	},
	render: function () {
		var inherit = this.props.style;
		var hideWidth = 37;
		var style = {};

		style.base = _.extend({}, inherit, {
			overflow: 'visible'
		});
		/*style.wrapper = _.extend({}, inherit, {
			overflow: 'hidden'
		});*/
		style.wrapper = {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			overflow: 'hidden'
		};
		style.content = _.extend({}, {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			overflowX: 'hidden',
			overflowY: 'scroll',
			width: 'calc(100% + ' + hideWidth + 'px + ' + this.props.margin + ')'
		});
		style.scrollCanvas = {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 'calc(' + 100 * + !this.state.showScroller + '% - 1px)',
			overflow: 'hidden',
			transition: '0.2s'
		}
		style.scrollContainer = {
			position: 'absolute',
			top: 0,
			left: 'calc(100% + ' + this.props.margin + ')',
			bottom: 0,
			width: hideWidth,
			overflow: 'visible',
			overflowX: 'visible',
			overflowY: 'visible',
			/*backgroundImage: 'url("public/ruler.png")',
			backgroundRepeat: 'repeat-y',
			borderRight: '3px solid rgba(13,117,177,0.5)',
			transition: '0.5s'*/
		};
		style.scroller = {
			opacity: +this.state.showScroller,
			position: 'absolute',
			top: this.state.position + '%',
			right: 4,
			zIndex: 1,
			width: 60,
			height: 60,
			margin: -30,
			backgroundImage: 'url("public/arrow-left-dull.png")',
			backgroundPosition: 'center center',
			cursor: 'pointer',
			transition: 'opacity 0.2s'
		};
		style.scrollerBright = {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			backgroundImage: 'url("public/arrow-left.png")',
			backgroundPosition: 'center center',
			opacity: +this.state.glow,
			transition: '0.2s'
		};


		return (
			<div style={style.base}>
				<div style={style.wrapper}>
					<div style={style.content} ref="content" onScroll={this.syncScroller} ref='content'>
						{this.props.children}
					</div>
				</div>
				<div style={style.scrollContainer} ref="scrollContainer">
					<div style={style.scrollCanvas}>
						<canvas id="canvas" width="0" height="0" ref="scrollCanvas"></canvas>
					</div>
					<div style={style.scroller} onMouseOver={this.startGlow} onMouseOut={this.isScrolling ? false : this.endGlow} onMouseDown={this.startScroll}>
						<div style={style.scrollerBright}></div>
					</div>
				</div>
			</div>
		);
	},
	startGlow: function () {
		this.setState({ glow: true });
	},
	endGlow: function () {
		this.setState({ glow: false });
	},
	checkShowScroller: function () {
		this.updateCoordinates();

		var showScroller = this.contentScrollHeight > this.contentClientHeight
		if (showScroller && !this.state.showScroller) {	this.setState({ showScroller: true }); } 
		if (!showScroller && this.state.showScroller) { this.setState({ showScroller: false }); }

		return showScroller;
	},
	updateCoordinates: function () {
		this.scrollContainer = React.findDOMNode(this.refs.scrollContainer);
		this.content = React.findDOMNode(this.refs.content);

		this.scrollerTop = this.scrollContainer.getBoundingClientRect().top;
		this.scrollerHeight = this.scrollContainer.clientHeight;
		this.contentScrollHeight = this.content.scrollHeight;
		this.contentClientHeight = this.content.clientHeight;
	},
	updateScroller: function (y) {
		var percent = (y - this.scrollerTop) / this.scrollerHeight;
		var position = Math.min(Math.max(percent * 100, 0), 100);

		this.content.scrollTop = (this.contentScrollHeight - this.contentClientHeight) * percent;

		this.setState({ position: position });
	},
	syncScroller: function () {
		if (this.isScrolling) return;

		this.updateCoordinates();

		var position = (this.content.scrollTop / (this.contentScrollHeight - this.contentClientHeight)) * 100;
		this.setState({ position: position });
	},
	startScroll: function (e) {
		e.preventDefault();
		this.isScrolling = true;
		this.updateCoordinates();

		var sendUpdate = function (e) {
			this.updateScroller(e.clientY);
		}.bind(this);

		window.addEventListener('mousemove', sendUpdate);
		window.addEventListener('mouseup', function (event) {
			this.isScrolling = false;
			this.setState({ glow: false });
			window.removeEventListener('mousemove', sendUpdate);
		}.bind(this));
	}
});

module.exports = Scroller;
