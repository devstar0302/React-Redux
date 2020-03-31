import { concat } from 'lodash'

function get2StepLinePoints (start, end, isSidePoint) {
  const points = []
  if (isSidePoint) {
    if (start.y === end.y) return points
    points.push({ x: start.x + (end.x - start.x) / 2, y: start.y })
    points.push({ x: start.x + (end.x - start.x) / 2, y: end.y })
  } else {
    if (start.x === end.x) return points
    points.push({ x: start.x, y: start.y + (end.y - start.y) / 2 })
    points.push({ x: end.x, y: start.y + (end.y - start.y) / 2 })
  }

  return points
}

export function findStepLines (startObject, startPos, startPoint, endObject, endPos, endPoint) {
  let points = [{ x: startPos.x, y: startPos.y }]

  if (startObject && endObject) {
    // Case 1 : 2-step lines
    if ((startObject.isTopPoint(startPoint) && endObject.isBottomPoint(endPoint) && startPos.y > endPos.y) ||
      (startObject.isLeftPoint(startPoint) && endObject.isRightPoint(endPoint) && startPos.x > endPos.x) ||
      (startObject.isRightPoint(startPoint) && endObject.isLeftPoint(endPoint) && startPos.x < endPos.x) ||
      (startObject.isBottomPoint(startPoint) && endObject.isTopPoint(endPoint) && startPos.y < endPos.y)) {
      return concat(points, get2StepLinePoints(startPos, endPos, startObject.isLeftPoint(startPoint) || startObject.isRightPoint(startPoint)), endPos)
    }

    // Case 2 : 3-step lines
    if (startObject.isRightPoint(startPoint) && endObject.isLeftPoint(endPoint) && startPos.x > endPos.x) {
      points.push({ x: startPos.x + 20, y: startPos.y })
      points.push({ x: startPos.x + 20, y: startPos.y + 100 })
      points.push({ x: endPos.x - 20, y: startPos.y + 100 })
      points.push({ x: endPos.x - 20, y: endPos.y })
    } else if (startObject.isLeftPoint(startPoint) && endObject.isRightPoint(endPoint) && startPos.x < endPos.x) {
      points.push({ x: startPos.x - 20, y: startPos.y })
      points.push({ x: startPos.x - 20, y: startPos.y + 100 })
      points.push({ x: endPos.x + 20, y: startPos.y + 100 })
      points.push({ x: endPos.x + 20, y: endPos.y })
    } else if (startObject.isTopPoint(startPoint) && endObject.isBottomPoint(endPoint) && startPos.y < endPos.y) {
      points.push({ x: startPos.x, y: startPos.y - 20 })
      points.push({ x: startPos.x - 100, y: startPos.y - 20 })
      points.push({ x: startPos.x - 100, y: endPos.y + 20 })
      points.push({ x: endPos.x, y: endPos.y + 20 })
    } else if (startObject.isBottomPoint(startPoint) && endObject.isTopPoint(endPoint) && startPos.y > endPos.y) {
      points.push({ x: startPos.x, y: startPos.y + 20 })
      points.push({ x: startPos.x + 100, y: startPos.y + 20 })
      points.push({ x: startPos.x + 100, y: endPos.y - 20 })
      points.push({ x: endPos.x, y: endPos.y - 20 })
    }
  }

  return concat(points, endPos)
}
