var gs = require('./globalStyles');

var style = {
	base: {
		position: 'fixed',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	shade: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'black',
		opacity: '0.9'
	},
	modal: {
		position: 'absolute',
		top: '33%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 480,
		background: 'rgba(0, 11, 24, 0.8)',
		border: '1px solid #0c67a1'
	},
	content: {
		padding: '1em'
	},
	leave: {
		position: 'absolute',
		right: 0,
		bottom: '100%'
	},
	h1: {

	}
}

style.link = _.extend({}, gs.headerFont, gs.brightBlueFont, {
	textDecoration: 'none'
});

var About = React.createClass({
	render: function () {
		return (
			<div style={style.base}>
				<div style={style.shade} onClick={this.kill}></div>
				<div style={style.modal}>
					<div style={style.content}>
						<h1 style={style.h1}>About RSI_DB</h1>
						<p>
							This site was built for use by the <a target="_blank" href="http://robertsspaceindustries.com/" style={style.link}>Star Citizen</a> community. The information contained on it was based on a <a target="_blank" href="http://i.imgur.com/JzlD7Nd.png" style={style.link}>chart</a> created by <a href="http://www.reddit.com/user/NimmoG" style={style.link}>/u/NimmoG</a> on <a target="_blank" href="http://www.reddit.com/r/starcitizen/comments/2zwtw7/star_citizen_upgrade_paths_flowchart_now_with_rec/" style={style.link}>Reddit</a>. The data backing this site is available in JSON format:
							<ul>
								<li><a target="_blank" href="https://github.com/kgsherman/rsidb/blob/master/js/db/ships.json" style={style.link}>Ship data</a></li>
								<li><a target="_blank" href="https://github.com/kgsherman/rsidb/blob/master/js/db/mfg.json" style={style.link}>Manufacturer data</a></li>
							</ul>
							Community contribution is welcome, and pull requests on Github are encouraged!
						</p>
						<p>
							RSI_DB is a fan-made tool 100% unaffiliated with Star Citizen, Roberts Space Industries, or Cloud Imperium Games. All styles and assets that are originally from robertsspaceindustries.com have been reused without permission.
						</p>
						<p>
							To get in touch, post on <a target="_blank" href="https://github.com/kgsherman/rsidb" style={style.link}>Github</a> or <a target="_blank" href="http://www.reddit.com/message/compose/?to=snoee" style={style.link}>send a message to /u/snoee on reddit</a>.
						</p>
					</div>
				</div>
			</div>
		);
	},
	kill: function () {
		this.props.onKill();
	}
});

module.exports = About;

