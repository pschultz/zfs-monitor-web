var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zfs/capacity-view', 'zfs/distribution-view'], function(ZfsCapacityView, ZfsDistributionView) {
  var FilesystemView;
  FilesystemView = (function(_super) {

    __extends(FilesystemView, _super);

    function FilesystemView() {
      this.render = __bind(this.render, this);
      FilesystemView.__super__.constructor.apply(this, arguments);
    }

    FilesystemView.prototype.render = function() {
      var html, template;
      template = $("#filesystems-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.renderZfsCapacity();
      this.renderZfsDistribution();
      return this.el;
    };

    FilesystemView.prototype.renderZfsCapacity = function() {
      var view;
      view = new ZfsCapacityView({
        model: this.model,
        className: 'zfs-capacity widget c2 r2'
      });
      return $(this.el).append(view.render());
    };

    FilesystemView.prototype.renderZfsDistribution = function() {
      var view;
      view = new ZfsDistributionView({
        collection: this.model.get('filesystems'),
        model: this.model,
        className: 'zfs-distribution widget c2 r2'
      });
      return $(this.el).append(view.render());
    };

    return FilesystemView;

  })(Backbone.View);
  return FilesystemView;
});
