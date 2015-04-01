var gs = require('./globalStyles');
var ToolTip = require('./toolTip');

var style = {
	base: {
		position: 'fixed',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		zIndex: 2
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
		width: 550,
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
		paddingBottom: '0.25em',
		borderBottom: '1px solid rgba(29, 63, 98, 0.9)'
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
						<h1 style={style.h1}>About the Citizen's Conversion Guide</h1>
						<p>
							Given your current ship, CCG discovers which ships are available via cross- and intra-chassis upgrade chains. It then computes the cheapest path from your current ship to your final upgrade, getting you the best deal possible.
						</p>
						<p>
							In some cases, the cheapest paths include converting to ships that aren't currently on sale. These paths are filtered out by default, but can be shown using the checkbox at the top of the result list.
						</p>
						<p>
							This site was built for use by the <a target="_blank" href="http://robertsspaceindustries.com/" style={style.link}>Star Citizen</a> community. The data it utilizes was based on a <a target="_blank" href="http://i.imgur.com/JzlD7Nd.png" style={style.link}>chart</a> created by <a target="_blank" href="http://www.reddit.com/r/starcitizen/comments/2zwtw7/star_citizen_upgrade_paths_flowchart_now_with_rec/" style={style.link}>/u/NimmoG on Reddit</a>. This data is available in JSON format on Github:
							<ul>
								<li><a target="_blank" href="https://github.com/kgsherman/ccg/blob/master/js/db/ships.json" style={style.link}>Ship data</a></li>
								<li><a target="_blank" href="https://github.com/kgsherman/ccg/blob/master/js/db/mfg.json" style={style.link}>Manufacturer data</a></li>
							</ul>
							Community contribution is welcome, and pull requests are always encouraged.
						</p>
						<p>
							CCG is a fan-made tool 100% unaffiliated with Star Citizen, Roberts Space Industries, or Cloud Imperium Games. All styles and assets that are originally from robertsspaceindustries.com have been reused without permission.
						</p>
						<p>
							To get in touch, post on <a target="_blank" href="https://github.com/kgsherman/ccg" style={style.link}>Github</a> or <a target="_blank" href="http://www.reddit.com/message/compose/?to=snoee" style={style.link}>send a message to /u/snoee</a> on Reddit.
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

