require([
  'file',
  'nconf',
  'express',
  'underscore',
  'backbone',
  'brainy-sync',
  'src/index'
], function(file, nconf, express, _, Backbone, Sync, api) {

  nconf.argv();
  nconf.env();

  nconf.defaults({

    http: {
      port: 80
    },

    paths: {
      resources: null
    },

    db: {
      host: '127.0.0.1',
      port: 27017,
      name: 'brainy-api'
    }

  });

  var app = express();

  Backbone.sync = Sync(nconf.get('db'));

  file.walk(nconf.get('paths').resources, function(n, p, d, files) {
    require(files, function() {
      api(app, _.values(arguments));
    });
  });

  app.listen(nconf.get('http').port);

});
