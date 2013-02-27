if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'underscore',
  'express'
], function(_, express) {

  return function(app, resources) {

    // make sure we can decode POST body data
    app.use(express.bodyParser());

    // add cors headers
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      next();
    });

    // setup the routes for each model or collection
    _(resources).each(function(Resource) {
      var path = Resource.prototype.urlRoot || Resource.prototype.url,
        is_model = !Resource.prototype.model,
        model_ep = "" + path + "/:_id",
        coll_ep = path;

      if (is_model) {

        // OPTIONS /:urlRoot/:id
        app.options(coll_ep, function(req, res) {
          res.send(200);
        });

        // OPTIONS /:urlRoot/:id
        app.options(model_ep, function(req, res) {
          res.send(200);
        });

        // POST /:urlRoot
        app.post(coll_ep, function(req, res) {
          var attrs = req.body,
            resource = new Resource();
          resource.on('invalid', function() {
            return res.send(400, resource.validationError);
          });
          return resource.save(attrs, {
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

        // GET /:urlRoot/:id
        app.get(model_ep, function(req, res) {
          var attrs = req.params,
            query = req.query,
            resource = new Resource(attrs);
          return resource.fetch({
            data: query,
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

        // DELETE /:urlRoot/:id
        app.del(model_ep, function(req, res) {
          var attrs = req.params,
            resource = new Resource(attrs);
          return resource.destroy({
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

        // PUT /:urlRoot/:id
        app.put(model_ep, function(req, res) {
          var attrs = req.params,
            body = req.body,
            resource = new Resource(attrs);
          resource.on('invalid', function() {
            return res.send(400, resource.validationError);
          });
          return resource.save(body, {
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

        // PATCH /:urlRoot/:id
        app.patch(model_ep, function(req, res) {
          var attrs = req.params,
            body = req.body,
            resource = new Resource(attrs);
          resource.on('invalid', function() {
            return res.send(400, resource.validationError);
          });
          return resource.save(body, {
            patch: true,
            validate: false,
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

      } else {

        // OPTIONS /:url
        app.options(coll_ep, function(req, res) {
          res.send(200);
        });

        // GET /:url
        app.get(coll_ep, function(req, res) {
          var attrs = req.query,
            resource = new Resource();
          return resource.fetch({
            data: attrs,
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

      }

    });

  };

});