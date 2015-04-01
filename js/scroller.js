var Scroller = React.createClass({
	getInitialState: function () {
		return {
			position: 0,
			showScroller: true
		};
	},
	componentDidMount: function () {
		this.isScrolling = false;
		if (this.checkShowScroller()) { this.syncScroller(); }
		window.addEventListener('resize', this.checkShowScroller());
	},
	componentDidUpdate: function () {
		this.checkShowScroller();
	},
	render: function () {
		var inherit = this.props.style;
		var hideWidth = 20;
		var style = {};

		style.wrapper = _.extend({}, inherit, {
			overflow: 'hidden'
		});
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
		style.scrollContainer = _.extend({}, inherit, {
			left: 'calc(100% + ' + this.props.margin + ')',
			width: hideWidth,
			overflow: 'visible',
			overflowX: 'visible',
			overflowY: 'visible',
			backgroundImage: 'url("public/ruler.png")',
			backgroundRepeat: 'repeat-y'
		});
		style.scroller = {
			display: this.state.showScroller ? 'block' : 'none',
			position: 'absolute',
			top: this.state.position + '%',
			left: '50%',
			zIndex: 1,
			width: 60,
			height: 60,
			margin: -30,
			backgroundImage: 'url("public/arrow-left.png")',
			backgroundPosition: 'center center',
			cursor: 'pointer'
		};

		return (
			<div>
				<div style={style.wrapper}>
					<div style={style.content} ref="content" onScroll={this.syncScroller}>
						{this.props.children}
					</div>
				</div>
				<div style={style.scrollContainer} ref="scrollContainer">
					<div style={style.scroller} onMouseDown={this.startScroll}></div>
				</div>
			</div>
		);
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
			window.removeEventListener('mousemove', sendUpdate);
		}.bind(this));
	}
});

module.exports = Scroller;
