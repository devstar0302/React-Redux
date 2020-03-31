fabric.BiPieChart = fabric.util.createClass(fabric.Group, {

  onMoving: function(e, diff, group){
    var me = this;
    me.updateLines(group, diff, me);
  },

  onScaling: function(e) {
    var me = this;
    me.updateLines();
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  getConnectionPoint: function(point, group) {
    return mapObject.getConnectionPoint(this, point, group);
  },

  onMoved: function(group) {
    var me = this;
    var map = me.canvas.map;
    return map.notifyMoved(me.id, {
      left: me.left + (group ? group.oCoords.mt.x: 0),
      top: me.top + (group ? group.oCoords.ml.y: 0),
      width: me.width * me.scaleX,
      height: me.height * me.scaleY,
    }, null, null, me.data ? me.data.fatherid : 0);
  },

  updateLines: function(group, diff, object) {
    var me = this;
    $.each(me.lines, function(i, line){
      line.updatePosition(group, diff, object);
    });
  },

  update: function(config) {
    var me = this;
    me.set(config);

    me.setCoords();
    me.updateLines();
  },

  remove: function(){
    var me = this;
    var map = me.canvas.map;

    $.each(me.lines.splice(0), function(i, line){
      line.remove();
    });

    map.removeObject(me);
    me.canvas.remove(me);

    this.callSuper('remove');
  },
});

fabric.BiPieChart.create = function(options){
  var defaults = {
    id: 0,

    objectType: MapItemType.BI,
    objectSubType: MapItemType.BiPieChart,
    lines: [],
    canvas: null,
    hasRotatingPoint: false,
  };

  var config = $.extend({}, defaults, options);
  var deviceObj = new fabric.BiPieChart([], config);

  /////////
  var svgDiv = $('<div/>').css({position: 'absolute', width: 200, height: 200, top: 0});
  $(config.canvas.lowerCanvasEl).parent().prepend(svgDiv);

  var plot = $.plot(svgDiv, config.graphdata, {
    series : {
      pie : {
        show : true,
        radius : 9 / 10,
        label : {
          show : true,
          radius : 3 / 5,
          formatter : function (label, series) {
            return '<div style="font-size:8pt; text-align:center; padding:2px; color:white;">' + label + '<br/>' + series.data[0][1] + '</div>';
          },
          threshold : 0.1
        },
        stroke: {
          color: 'black'
        },
      }
    },

    legend: {
      show: false
    }
  });


  html2canvas(svgDiv[0], {
    onrendered: function(canvas) {
      svgDiv.hide();

      fabric.Image.fromURL(canvas.toDataURL(), function(object) {
        object.set({
          selectable: false,
          hasControls: false,
          hasBorders: false,
        });

        object.hasBorders = false;
        object.canvas = config.canvas;
        deviceObj.addWithUpdate(object);

        deviceObj.left = config.left;
        deviceObj.top = config.top;
        deviceObj.scaleX = config.width / deviceObj.width;
        deviceObj.scaleY = config.height / deviceObj.height;

        config.canvas.add(deviceObj);
        config.canvas.renderAll();
      });

      setTimeout(function(){
        plot.destroy();
        svgDiv.remove();
      }, 0);
    }
  });

  return deviceObj;
};
