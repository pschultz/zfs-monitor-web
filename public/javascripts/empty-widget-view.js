var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var EmptyWidgetView;
  EmptyWidgetView = (function(_super) {

    __extends(EmptyWidgetView, _super);

    function EmptyWidgetView() {
      EmptyWidgetView.__super__.constructor.apply(this, arguments);
    }

    EmptyWidgetView.prototype.render = function() {
      var html, template;
      template = $("#empty-widget-tmpl");
      html = template.tmpl();
      return $(this.el).html(html);
    };

    return EmptyWidgetView;

  })(Backbone.View);
  return EmptyWidgetView;
});
