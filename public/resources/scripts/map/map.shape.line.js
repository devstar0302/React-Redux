
fabric.ShapeLine = fabric.util.createClass(fabric.Object, {

  initialize: function (options) {
    options || (options = {});
    this.callSuper('initialize', options);

    var groupItems = [];

    for (var i = 0; i < 1; i++) {
      var line = new fabric.ShapeLineItem([0, 0, 0, 0], {
        strokeWidth: parseInt(options.strokeWidth || 1),
        stroke: options.strokeColor || 'rgb(255,255,255)',
        originX: 'center',
        originY: 'center',

        objectType: MapItemType.Shape,
        objectSubType: MapItemType.ShapeLine,
        strokeDashArray: options.strokeDashArray,

        canvas: this.canvas,

        selectable: false,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,

        lockScalingX: true,
        lockScalingY: true,

        line: this,
      });
      this.steps.push(line);

      this.canvas.add(line);
    }

    $.each(this.steps, function(i, step){
      step.addHandles();
    });

    this.onEditStateChange(this.canvas.map.editable);

    this.updatePosition();
  },

  addAnim: function(reverse, color) {
    var me = this;

    var line = me.steps[0];

    var lineAnim = new fabric.ShapeLineAnim({
      canvas: me.canvas,
    });

    if (color) lineAnim.color = color;

    lineAnim.line = line;
    lineAnim.addDots();
    lineAnim.setDirection(reverse);
    lineAnim.setVisible(!me.canvas.map.editable && me.canvas.map.trafficVisible);
    lineAnim.updatePosition();

    line.anim = lineAnim;
  },

  onEditStateChange: function(editable){
    var me = this;
    $.each(me.steps, function(i, step){
      step.onEditStateChange(editable);
    });
  },

  showHandles: function(show){
    var me = this;
    me.steps[0].showHandles(show);
  },

  handleVisible: function() {
    var me = this;
    return me.steps[0].handleVisible();
  },

  hasPoint: function(object, point) {
    var me = this;
    return (me.startObj == object && me.startPoint == point) ||
      (me.endObj == object && me.endPoint == point);
  },

  changePoint: function(object, point, isStart){
    var me = this;
    var map = me.canvas.map;
    if(me == map.selLine) {
      map.addNewLine(me.startObj, me.startPoint, object, point);
      return;
    }

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

  updatePosition: function (group, diff, object) {
    var me = this;

    if (!me.steps || !me.steps.length) return;

    var startObj = me.startObj;
    var endObj = me.endObj ? me.endObj : startObj;

    var startX,startY,endX,endY;

    if (diff && object) {
      startX = me.steps[0].x1;
      startY = me.steps[0].y1;
      endX = me.steps[0].x2;
      endY = me.steps[0].y2;

      if (object == startObj) {
        startX += diff.x;
        startY += diff.y;
      }
      if (object == endObj) {
        endX += diff.x;
        endY += diff.y;
      }
    } else {
      var startXY = me.startObj ? startObj.getConnectionPoint(me.startPoint, group) : {x: -100 , y: -100};
      var endXY = me.endObj ? endObj.getConnectionPoint(me.endPoint, group) : startXY;

      startX = startXY.x;
      startY = startXY.y;
      endX = endXY.x;
      endY = endXY.y;

      if (Math.abs(startX - endX) < 1) startX = endX;
    }

    var groupItems = [];

    var step = me.steps[0];
    step.set({
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
    });
    step.updatePosition(null, group);
    step.anim && step.anim.updatePosition();
  },

  //////////////////////////////////////////////////////////////////////////////////////

  changeStrokeWidth: function(increase) {
    var me = this;

    $.each(me.steps, function (i, step) {
      if (increase) {
        if (step.strokeWidth < 10) step.strokeWidth += 1;
      } else {
        if (step.strokeWidth > 1) step.strokeWidth -= 1;
      }
    });

    me.canvas.renderAll();

    var map = me.canvas.map;
    map.notifyLineStyleChange(me, {
      color: me.getStrokeColor(),
      width: me.getStrokeWidth(),
    });
  },

  changeStrokeColor: function(color) {
    var me = this;

    $.each(me.steps, function (i, step) {
      step.stroke = color;
    });

    me.canvas.renderAll();

    var map = me.canvas.map;
    map.notifyLineStyleChange(me, {
      color: me.getStrokeColor(),
      width: me.getStrokeWidth(),
    });
  },

  getStrokeColor: function() {
    var me = this;
    return me.steps[0].stroke;
  },

  getStrokeWidth: function() {
    var me = this;
    return me.steps[0].strokeWidth;
  },

  update: function(config) {
    var me = this;
    $.each(me.steps, function(i, step){
      step.set({
        strokeWidth: parseInt(config.strokeWidth || 1),
        stroke: config.strokeColor || 'rgb(255,255,255)',
      });
    });

    me.set({
      id: config.id || me.id
    });
  },

  //////////////////////////////////////////////////////////////////////////////////////

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

    $.each(me.steps, function (i, step) {
      step.anim && step.anim.remove();
      step.remove && step.remove();
    });
    me.steps = [];

    map.removeConnector(me);

    this.callSuper('remove');
  },
});

fabric.ShapeLine.create = function(options){
  var defaults = {
    id: 0,

    objectType: MapItemType.Shape,
    objectSubType: MapItemType.ShapeLineGroup,
    steps: [],
    group: null,

    startObj: null,
    endObj: null,
    startPoint: 0,
    endPoint: 0,

    canvas: null,
    hasRotatingPoint: false,
  };

  var config = $.extend({}, defaults, options);
  var deviceObj = new fabric.ShapeLine(config);

  return deviceObj;
};
