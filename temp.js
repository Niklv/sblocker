//Config
var nconf = require('nconf');
nconf.use('memory').argv().env();
if (nconf.get('NODE_ENV') != 'production') nconf.set('NODE_ENV', 'development');
nconf.add('env_config', {type: 'file', file: './config/' + nconf.get('NODE_ENV') + '.json'});
nconf.add('defaults', {type: 'file', file: './config/default.json'});

require('./controllers/push_notification').pushClientDbUpdate();
