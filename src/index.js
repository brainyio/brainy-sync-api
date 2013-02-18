if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'underscore',
  'express'
], function(_, express) {

  return function(app, resources) {

    // make sure we can decode POST body data
    app.use(express.bodyParser());

    // setup the routes for each model or collection
    _(resources).each(function(Resource) {
      var path = Resource.prototype.urlRoot || Resource.prototype.url,
        is_model = !Resource.prototype.model,
        model_ep = "" + path + "/:_id",
        coll_ep = path;

      if (is_model) {

        // POST /:urlRoot
        app.post(coll_ep, function(req, res) {
          var attrs = req.body,
            resource = new Resource();
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
            resource = new Resource(attrs);
          return resource.fetch({
            success: function(model, resp) {
              return res.send(resp);
            },
            error: function(model, resp) {
              return res.send(resp);
            }
          });
        });

      } else {

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