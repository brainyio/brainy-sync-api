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
      port: 8000
    },

    paths: {
      resources: 'js/resources'
    },

    sync: {
      adapter: 'mongodb',
      options: {
        host: '127.0.0.1',
        port: 27017,
        name: 'brainy-sync-api'
      }
    }

  });

  var app = express(),
    sync_conf = nconf.get('sync'),
    paths_conf = nconf.get('paths'),
    http_conf = nconf.get('http');

  Backbone.sync = Sync(sync_conf.adapter, sync_conf.options);

  file.walk(paths_conf.resources, function(n, p, d, files) {
    require(files, function() {
      api(app, _.values(arguments));
    });
  });

  app.listen(http_conf.port);

});
