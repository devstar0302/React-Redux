
fabric.ShapeLineItem = fabric.util.createClass(fabric.Line, {
  initialize: function (points, options) {
    options || (options = {});
    this.callSuper('initialize', points, options);
  },

  addHandles: function(){
    var me = this;

    var config = {
      line: me,
      visible: false,
    };

    var point1 = new fabric.ShapeLineHandle(config);
    var point2 = new fabric.ShapeLineHandle(config);

    point1.index = 0;
    point2.index = 1;

    me.canvas.add(point1);
    me.canvas.add(point2);
    me.set("handles", [point1, point2]);

    me.updatePosition();
  },

  onMoving: function(e, diff, group){
    var me = this;
    if(group) {
      return;
    }
    me.reset();
  },

  onSelected: function(){
    var me = this;
    me.showHandles(true);
  },

  onSelectionCleared: function(){
    var me = this;
    me.showHandles(false);
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  showHandles: function(show) {
    var me = this;
    show = show == true;
    me.handles[0].visible = show;
    me.handles[1].visible = show;

    if(show) {
      me.bringToFront();
      me.handles[0].bringToFront();
      me.handles[1].bringToFront();
    } else {
      me.sendToBack();
    }
  },

  handleVisible: function() {
    var me = this;
    return me.handles[0].visible;
  },

  onMovingHandle: function(handle) {
    var me = this;
    var pts = ['x1', 'y1', 'x2', 'y2'];
    if(handle.index >= 0 && handle.index < 2) {
      var values = {};
      values[pts[handle.index * 2 + 0]] = handle.left;
      values[pts[handle.index * 2 + 1]] = handle.top;
      me.set(values);
      me.setCoords();
    }
  },

  onDropHandle: function(handle, nearObject, nearPoint) {
    var me = this;
    var pts = ['x1', 'y1', 'x2', 'y2'];
    if(handle.index >= 0 && handle.index < 2) {
      var values = {};
      var pos = nearObject.getConnectionPoint(nearPoint);
      values[pts[handle.index * 2 + 0]] = pos.x;
      values[pts[handle.index * 2 + 1]] = pos.y;
      me.set(values);
      me.setCoords();

      me.line.changePoint(nearObject, nearPoint, handle.index == 0);
    }
  },

  reset: function(){
    var me = this;
    me.line.updatePosition();
    me.canvas.renderAll();
  },

  updatePosition: function(diff, group){
    var me = this;
    me.setCoords();

    if(diff) {
      me.set({
        x1: me.x1 + diff.x,
        y1: me.y1 + diff.y,
        x2: me.x2 + diff.x,
        y2: me.y2 + diff.y,
      });
    }

    me.handles[0].set({
      left: me.x1,
      top: me.y1,
    });
    me.handles[0].setCoords();

    me.handles[1].set({
      left: me.x2,
      top: me.y2,
    });
    me.handles[1].setCoords();
  },

  //////////////////////////////////////////////////////////////////////////////////////

  //Overrride
  containsPoint: function(p){
    var me = this;

    var c = {
      x: p.x,
      y: p.y,
    };
    var pos = me.canvas.map.pan;
    var z = me.canvas.getZoom();
    if (pos) {
      c.x += pos.x * z - me.canvas.width / 2;
      c.y += pos.y * z - me.canvas.height / 2;
    }
    c.x /= z;
    c.y /= z;

    return me.dotLineLength(c.x, c.y, me.x1, me.y1, me.x2, me.y2, true) < 5;
  },

  lineLength: function (x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
  },

  calcDotPos: function(x, y, x0, y0, x1, y1){
    if(!(x1 - x0)) return {x: x0, y: y};
    else if(!(y1 - y0)) return {x: x, y: y0};

    var left, tg = -1 / ((y1 - y0) / (x1 - x0));
    return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
  },

  dotLineLength: function(x, y, x0, y0, x1, y1, o) {
    var me = this;

    if(o && !(o = me.calcDotPos(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))){
      var l1 = me.lineLength(x, y, x0, y0), l2 = me.lineLength(x, y, x1, y1);
      return l1 > l2 ? l2 : l1;
    } else {
      var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
      return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////

  remove: function () {
    var me = this;

    if (me.anim) {
      me.anim.stop();
      me.anim.remove();
    }
    me.handles[0].remove();
    me.handles[1].remove();
    me.canvas.remove(me);
    this.callSuper('remove');
  },
});
