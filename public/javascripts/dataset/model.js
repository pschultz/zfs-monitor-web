var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var DatasetModel;
  DatasetModel = (function(_super) {

    __extends(DatasetModel, _super);

    function DatasetModel() {
      this.calculateFree = __bind(this.calculateFree, this);
      this.onChangeAllocated = __bind(this.onChangeAllocated, this);
      this.onChangeSize = __bind(this.onChangeSize, this);
      DatasetModel.__super__.constructor.apply(this, arguments);
    }

    DatasetModel.prototype.defaults = {
      size: 0,
      free: 0,
      allocated: 0,
      name: 'unnamed'
    };

    DatasetModel.prototype.initialize = function() {
      this.on('change:size', this.onChangeSize);
      this.on('change:allocated', this.onChangeAllocated);
      return this.calculateFree();
    };

    DatasetModel.prototype.onChangeSize = function() {
      return this.calculateFree();
    };

    DatasetModel.prototype.onChangeAllocated = function() {
      return this.calculateFree();
    };

    DatasetModel.prototype.calculateFree = function() {
      return this.set({
        free: this.get('size') - this.get('allocated')
      }, {
        silent: true
      });
    };

    return DatasetModel;

  })(Backbone.Model);
  return DatasetModel;
});
