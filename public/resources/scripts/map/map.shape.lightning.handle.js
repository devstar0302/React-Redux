fabric.ShapeLightningHandle = fabric.util.createClass(fabric.Circle, {
  initialize: function (options) {
    var defaults = {
      objectType: MapItemType.Shape,
      objectSubType: MapItemType.ShapeLightningHandle,
      radius: 5,
      fill: '#f55',
      top: 0,
      left: 0,
      originX: 'center',
      originY: 'center',

      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
    };
    options || (options = {});
    this.callSuper('initialize', $.extend(true, defaults, options));
  },

  onMoving: function(e, diff, group){
    var me = this;
    var map = me.canvas.map;
    me.setCoords();

    me.lightning.onMovingHandle(me);
    map.showNearestObject({
      x: me.left,
      y: me.top,
    });
  },

  onSelected: function(){
    var me = this;
    me.lightning.showHandles(true);
  },

  onSelectionCleared: function(){
    var me = this;
    me.lightning.showHandles(false);
  },

  onMouseUp: function(){
    var me = this;
    var map = me.canvas.map;

    var selRect = map.selRect;
    if(selRect.visible) {
      if(selRect.nearPoint >= 0) {
        me.set({
          left: selRect.nearPos.x,
          top: selRect.nearPos.y,
        });
        me.setCoords();

        me.lightning.onDropHandle(me, selRect.nearObject, selRect.nearPoint);
      } else {
        me.lightning.reset();
      }
      selRect.hide();
      map.canvas.renderAll();
    } else {
      me.lightning.reset();
    }
  },


  remove: function () {
    var me = this;
    me.canvas.remove(me);
    this.callSuper('remove');
  },
});
