var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var DiskView;
  DiskView = (function(_super) {

    __extends(DiskView, _super);

    function DiskView() {
      this.render = __bind(this.render, this);
      DiskView.__super__.constructor.apply(this, arguments);
    }

    DiskView.prototype.render = function() {
      var html, template;
      template = $("#disk-tmpl");
      html = template.tmpl(this.model.toJSON());
      this.el = $(html);
      $(this.el).addClass(this.model.get('status'));
      $(this.el).attr('id', this.model.cid);
      return this.el;
    };

    return DiskView;

  })(Backbone.View);
  return DiskView;
});
