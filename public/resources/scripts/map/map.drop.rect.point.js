fabric.DropRectPoint = fabric.util.createClass(fabric.Circle, {
  initialize: function (options) {
    options || (options = {});
    this.callSuper('initialize', options);
    this.set({
      fill: 'transparent',
      strokeWidth: 1,
      stroke: 'rgb(102,153,255)',

      originX: 'center',
      originY: 'center',

      selectable: false,
      hasBorders: false,
      hasControls: false,
    });
  },

  onMouseDown: function(o){
    var me = this;
  },
});
