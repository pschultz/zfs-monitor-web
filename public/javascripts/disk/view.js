var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/model'], function(ZPool) {
  var DiskView;
  DiskView = (function(_super) {

    __extends(DiskView, _super);

    function DiskView() {
      this.render = __bind(this.render, this);
      DiskView.__super__.constructor.apply(this, arguments);
    }

    DiskView.prototype.initialize = function() {
      var self;
      self = this;
      this.model.on('change', this.render);
      return this.model.collection.on('remove', function(disk) {
        if (disk.cid === self.model.cid) return self.remove();
      });
    };

    DiskView.prototype.render = function() {
      var data, html, template;
      template = $("#disk-tmpl");
      data = this.model.toJSON();
      data.size = humanReadableBytes(data.size);
      html = template.tmpl(data);
      $(this.el).html(html);
      $(this.el).removeClass(ZPool.prototype.statusList.join(' ')).addClass(this.model.get('status'));
      return this.el;
    };

    return DiskView;

  })(Backbone.View);
  return DiskView;
});
