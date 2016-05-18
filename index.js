var _ = require("underscore"),
    Backbone = require("backbone"),
    IonicAppLib = require('ionic-app-lib'),
    Login = IonicAppLib.login,
    Package = IonicAppLib.package;

module.exports = function Poll(options) {
    _.extend(this, Backbone.Events);
    this.options = _.extend({
        interval: 3// poll every 3 minutes
    }, options);
    this.collection = new Backbone.Collection({
        model: Backbone.Model
    });
    this.collection.on("add", function(model) {
        this.trigger("add", model);
    });

    this.collection.on("change:status", _.bind(function(model) {
        console.log("[" + model.id + "] " + model.previous('status') + " => " + model.get('status'));
        switch(model.get('status')) {
            case 'SUCCESS':
                this.trigger("success", model);
                break;
            case 'FAILED':
                this.trigger("failed", model);
        }
    }, this));
};

_.extend(module.exports.prototype, {
    run: function() {
        var self = this;
        Login.requestLogIn(this.options.username, this.options.password).then(function(jar) {
            self.jar = jar;

            var minutesInterval = self.options.interval * 1000 * 60;
            self.timer = setInterval(_.bind(self.getData, self), minutesInterval);
            self.getData();
        }).fail(function(e) {
            throw("Login failed: " + e);
        });
    },
    stop: function() {
        clearInterval(this.timer);
    },
    getData: function() {
        return Package.listBuilds(this.options.appId, this.jar).then(_.bind(function(body) {
                if (body.data.length === 0) {
                    this.collection.reset();
                } else {
                    this.collection.set(body.data);
                }
            }, this))
            .catch(function(ex) {
                throw ex;
            });

    },
    onSuccess: function(handler) {
        this.on("success", handler);
    },
    onFail: function(handler) {
        this.on("failed", handler);
    },
    onAdd: function(handler) {
        this.on("add", handler);
    }
});
