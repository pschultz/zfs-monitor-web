var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/model'], function(ZPool) {
  var ZPoolCaptionView;
  ZPoolCaptionView = (function(_super) {

    __extends(ZPoolCaptionView, _super);

    function ZPoolCaptionView() {
      this.onChangeStatus = __bind(this.onChangeStatus, this);
      this.onChangeName = __bind(this.onChangeName, this);
      this.render = __bind(this.render, this);
      ZPoolCaptionView.__super__.constructor.apply(this, arguments);
    }

    ZPoolCaptionView.prototype.initialize = function() {
      this.model.on('change:name', this.onChangeName);
      return this.model.on('change:status', this.onChangeStatus);
    };

    ZPoolCaptionView.prototype.render = function() {
      var html, template;
      template = $("#zpool-caption-tmpl");
      html = template.tmpl(this.model.toJSON());
      return $(this.el).html(html);
    };

    ZPoolCaptionView.prototype.onChangeName = function() {
      return this.$("h1").text(this.model.get('name'));
    };

    ZPoolCaptionView.prototype.onChangeStatus = function() {
      return this.$("h2").text(this.model.get('status')).removeClass(ZPool.prototype.statusList.join(' ')).addClass(this.model.get('status'));
    };

    return ZPoolCaptionView;

  })(Backbone.View);
  return ZPoolCaptionView;
});
