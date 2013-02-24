# brainy-sync-api

brainy-sync-api can create a RESTful api by simply analyzing Backbone models and collections. it can be included in your Express application, or you can run it's built-in server.

## install

```
$ npm install brainy-sync-api
```

## use

### using the library

brainy-sync-api is a function which accepts two arguments: a reference to your Express application, and an array of Backbone models and collections. the models and collections are used to infer information about what APIs to build, and the app object is required to configure the actual routes.

```
require([
  'express',
  'backbone',
  'brainy-sync',
  'brainy-sync-api'
], function(express, Backbone, Sync, Api) {

  var app = express();

  Backbone.sync = Sync({
    host: '127.0.0.1',
    port: 27017,
    name: 'brainy-sync-api'
  });

  var User = Backbone.Model.extend({
    urlRoot: '/users'
  });

  Api(app, [User])

  app.listen(80);

});

```

**important**: the brainy-sync-api library does not modify the behavior of Backbone.sync. this means you are responsible for overriding Backbone.sync with a server supported method before initializing brainy-sync-api. for example, the built-in server (below) overrides sync for you, using [brainy-sync](http://github.com/brainyio/brainy-sync).

### running the built-in server

a built-in server is included which accepts a path to a directory of models and collections and creates a standalone REST server.

```
$ brainy-sync-api --paths.resources=brainy-demo/src/js/resources
```

this will start a server exposing the http API methods (below). brainy-sync-api accepts configuration options to describe the http server, the MongoDB connection, and resources directory. the default configuration looks like this:

```
{

  http: {
    port: 80
  },

  paths: {
    resources: null
  },

  db: {
    host: '127.0.0.1',
    port: 27017,
    name: 'brainy-sync-api'
  }

}
```

brainy-sync-api uses [nconf](https://github.com/flatiron/nconf) (and by proxy [optimist](https://github.com/substack/node-optimist)) to parse command line options. see optimist documentation for more information on overriding configuration. see the `paths.resources` example for reference.

## methods

brainy-sync-api uses a resource's url() to determine which endpoint each resource should be exposed by. this means setting your models `urlRoot` to `/users` will expose that model's methods at `/users`. the methods it exposes are inferred based on the resources type (model or collection).

### models

when given a model, brainy-sync-api will create methods for reading or creating models.

- GET /:urlRoot/:id
- POST /:urlRoot

### collections

when given a collection, brainy-sync-api will create a method for reading that collection.

- GET /:url

## todo

- the api's external interface should act as middleware, while ideally removing the necessity to pass in the app object as an argument