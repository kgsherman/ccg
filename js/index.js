global.React = require('react/addons');
global.db = require('./db/ships.json');
global._ = require('lodash');

var App = require('./app');

React.render(
  <App db={db} />,
  document.getElementById('mount')
);