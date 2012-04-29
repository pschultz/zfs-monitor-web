var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['disk/view'], function(DiskView) {
  var DiskArrayView;
  DiskArrayView = (function(_super) {

    __extends(DiskArrayView, _super);

    function DiskArrayView() {
      this.renderDisk = __bind(this.renderDisk, this);
      this.render = __bind(this.render, this);
      DiskArrayView.__super__.constructor.apply(this, arguments);
    }

    DiskArrayView.prototype.render = function() {
      var disks, html, template;
      template = $("#diskarray-tmpl");
      html = template.tmpl(this.model.toJSON());
      this.el = $(html);
      disks = this.model.get('disks');
      disks.each(this.renderDisk);
      return $(this.el);
    };

    DiskArrayView.prototype.renderDisk = function(disk) {
      var view;
      view = new DiskView({
        model: disk,
        el: this.$("#" + disk.cid)
      });
      return $(this.el).find('.disks').append(view.render());
    };

    return DiskArrayView;

  })(Backbone.View);
  return DiskArrayView;
});
