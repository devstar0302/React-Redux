var tempOpts = {
  borderColor : "#ffffff",
  borderWidth : 2,
  defaultTemp : 26,
  fillColor : "red",
  labelSize : 18,
  labelColor : "white",
  maxTemp : 100,
  minTemp : 0,
  showLabel : true,
  width : 40
};

function createTempGauge(gauge, callback) {
  var padding = 4;
  var canvas = document.createElement("canvas"), ctx = canvas
    .getContext("2d"), currentTempText = gauge, currentTemp = parseInt(currentTempText);
  canvas.width = tempOpts.width;
  canvas.height = tempOpts.width * 2 + tempOpts.labelSize;

  var percentage = calculatePercentage(currentTemp, tempOpts.minTemp,
    tempOpts.maxTemp - tempOpts.minTemp);

  ctx.lineWidth = tempOpts.borderWidth;
  ctx.strokeStyle = tempOpts.borderColor;
  ctx.fillStyle = tempOpts.fillColor;
  ctx.font = "bold " + tempOpts.labelSize + "px Arial ";
  ctx.textAlign = "center";

  if (tempOpts.showLabel) {

    drawLabel(ctx, canvas.width / 2, 15, currentTempText);
  }
  ctx.beginPath();
  ctx.lineWidth = tempOpts.borderWidth;
  ctx.strokeStyle = tempOpts.borderColor;
  ctx.fillStyle = tempOpts.fillColor;
  fillTempGauge(ctx, 0, 20, tempOpts.width, tempOpts.width * 2 - padding,
    percentage);
  strokeTempGauge(ctx, 0, 20, tempOpts.width, tempOpts.width * 2 - padding);
  callback(canvas.toDataURL());
}

function calculatePercentage(temp, mintemp, length) {
  var percentage = (temp - mintemp) / length;
  percentage = percentage > 1 ? 1 : percentage;
  percentage = percentage < 0 ? 0 : percentage;
  return percentage;
}

function drawTemperatureGauge(ctx, x, y, width, height, spacing, fillPercent) {

  var wholeCircle = Math.PI * 2;
  var smallRadius = width / 3 / 2 - spacing;
  var xSmall = x + width / 2;
  var ySmall = y + smallRadius + spacing;

  var bigRadius = height / 6 - spacing;
  var xBig = x + width / 2;
  var yBig = y + height / 6 * 5;

  var offSet = Math.sqrt((Math.pow(bigRadius, 2) - Math.pow(smallRadius / 2,
    2)), 2);
  var twoThirdsLength = height / 6 * 5 - offSet - width / 3 / 2;

  var gauge = twoThirdsLength * fillPercent;

  var yBox = yBig - offSet - gauge;
  var xBox = xBig - width / 6 + spacing;
  var sRad = Math.asin(smallRadius / bigRadius);

  ctx.beginPath();
  ctx.arc(xSmall, yBox, smallRadius, 0, wholeCircle * -0.5, true);
  ctx.arc(xBig, yBig, bigRadius, wholeCircle * 0.75 - sRad, wholeCircle
    * -0.25 + sRad, true);
  ctx.closePath();
}

function strokeTempGauge(ctx, x, y, width, height) {
  drawTemperatureGauge(ctx, x, y, width, height, 0, 1);
  ctx.stroke();
}

function fillTempGauge(ctx, x, y, width, height, percent) {
  drawTemperatureGauge(ctx, x, y, width, height, tempOpts.borderWidth,
    percent);
  ctx.fill();
}

function drawLabel(ctx, x, y, text) {
  ctx.fillStyle = tempOpts.labelColor;
  ctx.fillText(text, x, y);
}
