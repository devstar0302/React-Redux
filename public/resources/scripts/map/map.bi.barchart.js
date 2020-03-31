fabric.BiBarChart = fabric.util.createClass(fabric.Group, {

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

fabric.BiBarChart.create = function(options){
  var defaults = {
    id: 0,

    objectType: MapItemType.BI,
    objectSubType: MapItemType.BIBarChart,
    lines: [],
    canvas: null,
    hasRotatingPoint: false,
  };

  var config = $.extend({}, defaults, options);
  var deviceObj = new fabric.BiBarChart([], config);

  /////////
  var svgDiv = $('<div/>').css({position: 'absolute', width: 200, height: 200, top: 0});
  $(config.canvas.lowerCanvasEl).parent().prepend(svgDiv);

  var plot = $.plot(svgDiv, [{
    color: '#428BCA',
    data: config.graphdata,
    bars: {
      fillColor: '#428BCA'
    }
  }], {
    legend: {
      show: false,
    },
    series: {
      bars: {
        show: true,
        barWidth: 0.4,
        align: 'center',
        lineWidth: 0,
        fill: true,
        fillColor: null
      },
      highlightColor: 'rgba(0,0,0,0.6)'
    },
    grid: {
      hoverable: false,
      borderWidth: 0,
      labelMargin: 10
    },
    yaxis: {
      color: '#edeff0',
      min: 0,
      minTickSize: 1,
      tickDecimals: 0,
    },
    xaxis: {
      min: -0.5,
      tickSize: 1,
      tickDecimals: 0,
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
