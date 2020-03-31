
fabric.ShapeLineAnim = fabric.util.createClass(fabric.Object, {
  initialize: function (options) {
    options || (options = {});
    this.callSuper('initialize',  options);

    this.reverse = false;
    this.color = '#2D3A54';
  },

  addDots: function() {
    var me = this;
    var i;

    me.points = [];
    for (i = 0; i < 5; i++) {
      me.addDot();
    }
  },

  addDot: function() {
    var me = this;
    var point = new fabric.Circle({
      radius: 1,
      fill: me.color,
      top: 0,
      left: 0,
      originX: 'center',
      originY: 'center',

      selectable: false,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,

      visible: false,
    });

    me.canvas.add(point);
    me.points.push(point);
  },

  setDirection: function(reverse){
    this.reverse = reverse;
  },

  play: function() {
    var me = this;
    me.animInterval = setInterval(function() {
      me.onPlay();
    }, 200);
  },

  stop: function() {
    clearInterval(this.animInterval);
  },

  onPlay: function() {
    var me = this;
    if (!me.points) return;
    if (!me.line) return;

    var line;
    if (me.reverse) {
      line = {
        x1: me.line.x2,
        y1: me.line.y2,
        x2: me.line.x1,
        y2: me.line.y1,
      }
    } else {
      line = {
        x1: me.line.x1,
        y1: me.line.y1,
        x2: me.line.x2,
        y2: me.line.y2,
      }
    }

    var spd = 5;
    var sign = 10;

    if (line.x1 == line.x2) {
      sign = (line.y1 - line.y2) / Math.abs(line.y1 - line.y2) * spd;
    } else {
      sign = (line.x1 - line.x2) / Math.abs(line.x1 - line.x2) * spd;
    }
    var isNeg = sign < 0;

    var prop = (line.y1 - line.y2) / (line.x1 - line.x2)

    me.points.forEach(function(point){
      if (line.x1 == line.x2) {
        point.top += sign;
        if ((point.top - line.y1 < 0) == isNeg) point.top = line.y2;
      } else {
        point.left += sign;
        if ((point.left - line.x1 < 0) == isNeg) point.left = line.x2;

        point.top = line.y2 + prop * (point.left - line.x2);
      }
      point.setCoords();

    });
  },

  setVisible: function(visible) {
    var me = this;
    if (!me.points) return;

    me.visible = visible;
    $.each(me.points, function(i, point){
      point.visible = visible;
    });
  },

  updatePosition: function() {
    var me = this;
    if (!me.points) return;
    if (!me.line) return;
    var line = me.line;

    var d = me.canvas.map.calcDistance(me.line.x1, me.line.y1, me.line.x2, me.line.y2);
    var count = Math.ceil(d / 15);
    while(me.points.length > count) {
      var point = me.points[me.points.length - 1];
      point.remove();
      me.points.splice(me.points.length - 1, 1);
    }

    while(me.points.length < count) {
      me.addDot();
    }

    $.each(me.points, function(i, point){
      if (line.x1 == line.x2) {
        point.left = line.x1;
        point.top = line.y1 + (line.y2 - line.y1) * i / me.points.length ;
      } else {
        point.left = line.x1 + (line.x2 - line.x1) * i / me.points.length ;
        point.top = line.y1 + (line.y2 - line.y1) * i / me.points.length ;
      }

      point.visible = me.visible;
      point.setCoords();
    });
  },

  remove: function () {
    var me = this;
    $.each(me.points, function(i, point){
      me.canvas.remove(point);
      point.remove();
    });
    me.canvas.remove(me);
    this.callSuper('remove');
  },
});