var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var ZfsView;
  ZfsView = (function(_super) {

    __extends(ZfsView, _super);

    function ZfsView() {
      this.render = __bind(this.render, this);
      ZfsView.__super__.constructor.apply(this, arguments);
    }

    ZfsView.prototype.initialize = function() {
      return this.model.on('change:free change:allocated change:size', this.render);
    };

    ZfsView.prototype.render = function() {
      var html, template;
      template = $("#zfs-capacity-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      return this.el;
    };

    return ZfsView;

  })(Backbone.View);
  return ZfsView;
});
