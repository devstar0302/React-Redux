fabric.ShapeLightning = fabric.util.createClass(fabric.Image, {
  initialize: function (options) {
    var defaults = {
      objectType: MapItemType.Shape,
      objectSubType: MapItemType.ShapeLightning,

      originX: 'center',
      originY: 'center',

      //selectable: false,
      hasBorders: false,
      hasControls: true,
      hasRotatingPoint: false,

      lockScalingX: false,
      lockScalingY: true,

      width: 50,
    };
    options || (options = {});
    this.callSuper('initialize');
    this.set($.extend(true, defaults, options));
    this.setControlsVisibility({
      tl: false,
      tr: false,
      mt: false,
      mb: false,
      ml: true,
      mr: true,
      bl: false,
      br: false,
    });
  },

  onMoving: function(e, diff, group){
    var me = this;
  },

  onScaling: function(e) {
    var me = this;
    me.reset();
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  addHandles: function(){
    var me = this;

    var config = {
      lightning: me,
      visible: false,
    };

    var point1 = new fabric.ShapeLightningHandle(config);
    var point2 = new fabric.ShapeLightningHandle(config);

    point1.index = 0;
    point2.index = 1;

    me.canvas.add(point1);
    me.canvas.add(point2);
    me.set("handles", [point1, point2]);

    me.updatePosition();
  },

  onMoving: function(e, diff, group){
    var me = this;
    if(group) return;
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
    var map = me.canvas.map;

    if(handle.index < 0 || handle.index > 1) return;


    var startObj = me.startObj;
    var endObj = me.endObj ? me.endObj : startObj;

    var startX = me.startObj ? startObj.getConnectionPoint(me.startPoint).x : -100;
    var startY = me.startObj ? startObj.getConnectionPoint(me.startPoint).y : -100;
    var endX = me.endObj ? endObj.getConnectionPoint(me.endPoint).x : startX;
    var endY = me.endObj ? endObj.getConnectionPoint(me.endPoint).y : startY;

    if (handle.index == 0){
      startX = handle.left;
      startY = handle.top;
    } else {
      endX = handle.left;
      endY = handle.top;
    }

    var centerX = (startX + endX) / 2.0;
    var centerY = (startY + endY) / 2.0;

    me.height = map.calcDistance(startX, startY, endX, endY) || 1;
    me.left = centerX;
    me.top = centerY;
    me.angle = map.calcAngle(centerX, centerY, startX, startY) + 90;
    me.setCoords();


    var z = me.canvas.getZoom();
    var offset = me.canvas.map.getPanOffset();

    me.handles[0].set({
      left: (me.oCoords.mt.x + offset.x) / z,
      top: (me.oCoords.mt.y + offset.y) / z,
    });
    me.handles[0].setCoords();

    me.handles[1].set({
      left: (me.oCoords.mb.x + offset.x) / z,
      top: (me.oCoords.mb.y + offset.y) / z,
    });
    me.handles[1].setCoords();
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

      me.changePoint(nearObject, nearPoint, handle.index == 0);
    }
  },

  hasPoint: function(object, point) {
    var me = this;
    return (me.startObj == object && me.startPoint == point) ||
      (me.endObj == object && me.endPoint == point);
  },

  changePoint: function(object, point, isStart){
    var me = this;
    var map = me.canvas.map;

    if(isStart) {
      if(me.startObj) {
        var index= me.startObj.lines.indexOf(me);
        if(index >= 0) me.startObj.lines.splice(index, 1);
      }
      me.startObj = object;
      me.startPoint = point;
      me.startObj.lines.push(me);
    } else {
      if(me.endObj) {
        var index= me.endObj.lines.indexOf(me);
        if(index >= 0) me.endObj.lines.splice(index, 1);
      }

      me.endObj = object;
      me.endPoint = point;
      me.endObj.lines.push(me);
    }

    map.notifyLineUpdate(me);
  },


  onMoved: function(group) {
    var me = this;
    var map = me.canvas.map;
    me.notifyMoved();
  },

  notifyMoved: function() {
    var me = this;
    var map = me.canvas.map;
    return map.notifyMoved(me.id, {
      width: me.width * me.scaleX,
      scaleX: me.scaleX,
    }, null, 'lightning', me.data ? me.data.fatherid : 0);
  },

  reset: function(){
    var me = this;
    me.updatePosition();
    me.canvas.renderAll();
  },

  updatePosition: function (group){
    var me = this;
    var map = me.canvas.map;

    var startObj = me.startObj;
    var endObj = me.endObj ? me.endObj : startObj;

    var startX = me.startObj ? startObj.getConnectionPoint(me.startPoint, group).x : -100;
    var startY = me.startObj ? startObj.getConnectionPoint(me.startPoint, group).y : -100;
    var endX = me.endObj ? endObj.getConnectionPoint(me.endPoint, group).x : startX;
    var endY = me.endObj ? endObj.getConnectionPoint(me.endPoint, group).y : startY;

    var centerX = (startX + endX) / 2.0;
    var centerY = (startY + endY) / 2.0;

    me.height = map.calcDistance(startX, startY, endX, endY) || 1;
    me.left = centerX;
    me.top = centerY;
    me.angle = map.calcAngle(centerX, centerY, startX, startY) + 90;

    if(group) {
      var found = false;
      var objects = group.getObjects();
      $.each(objects, function(i, item){
        if(item == me) {
          found = true;
          return false;
        }
      });
      if(found) {
        me.left -= group.left + group.width / 2;
        me.top -= group.top + group.height / 2;
      }
    }
    me.setCoords();

    if (me.handles && me.handles.length > 1) {
      var z = me.canvas.getZoom();
      var offset = me.canvas.map.getPanOffset();

      me.handles[0].set({
        left: (me.oCoords.mt.x + offset.x) / z,
        top: (me.oCoords.mt.y + offset.y) / z,
      });
      me.handles[0].setCoords();

      me.handles[1].set({
        left: (me.oCoords.mb.x + offset.x) / z,
        top: (me.oCoords.mb.y + offset.y) / z,
      });
      me.handles[1].setCoords();
    }
  },

  update: function(config) {
    var me = this;

    var scaleX = parseFloat(config.strokeWidth || 1);
    if (scaleX > 5) scaleX = 5;

    me.set({
      id: config.id || me.id,
      scaleX: scaleX
    });
  },

  remove: function () {
    var me = this;
    var map = me.canvas.map;

    if(me.startObj) {
      var index= me.startObj.lines.indexOf(me);
      if(index >= 0) me.startObj.lines.splice(index, 1);
    }

    if(me.endObj) {
      var index= me.endObj.lines.indexOf(me);
      if(index >= 0) me.endObj.lines.splice(index, 1);
    }

    me.handles[0].remove();
    me.handles[1].remove();

    map.removeConnector(me);
    me.canvas.remove(me);
    this.callSuper('remove');
  },
});

fabric.ShapeLightning.create = function(options){
  var defaults = {
    imageUrl: '/images/light.svg',
    canvas: null,
    startObj: null,
    endObj: null,
    startPoint: 0,
    endPoint: 0,
    width: 50,
    height: 50,
  };

  var config = $.extend({}, defaults, options);
  var scaleX = parseFloat(config.strokeWidth || 1);
  if (scaleX > 5) scaleX = 5;

  delete config.strokeWidth;

  var light = new fabric.ShapeLightning();
  light.set(config);

  light.setSrc(config.imageUrl, function(){
    light.set(config);
    light.set({scaleX: scaleX});

    light.addHandles();
    light.onEditStateChange(config.canvas.map.editable);
    light.setCoords();
    config.canvas.add(light);
  }, {crossOrigin: 'anonymous'});

  return light;
};
