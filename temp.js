//Config
var nconf = require('nconf');
nconf.use('memory').argv().env();
if (nconf.get('NODE_ENV') != 'production') nconf.set('NODE_ENV', 'development');
nconf.add('env_config', {type: 'file', file: './config/' + nconf.get('NODE_ENV') + '.json'});
nconf.add('defaults', {type: 'file', file: './config/default.json'});

//require('./controllers/push_notification').pushClientDbUpdate();

/*var Admin = require('./models').Admin;
 var newAdmin = new Admin();
 newAdmin.username = 'admin';
 newAdmin.password = "much_password";
 newAdmin.save(function (err) {
 if (err)
 throw err;
 console.log("SAVED!");
 });
