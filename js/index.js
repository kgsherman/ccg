global.React = require('react');
global.db = require('./db/ships.json');
global._ = require('lodash');

var App = require('./app');

React.render(
  <App db={db} />,
  document.getElementById('mount')
);