"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBigestContour = exports.findMax = exports.findLowest = exports.drawRectangle = exports.reorderContourToSquarePoints = void 0;
function reorderContourToSquarePoints(contours) {
    var points = [];
    var add = [];
    var diff = [];
    var ci = contours.get(0);
    var pairs = [];
    for (var j = 0; j < ci.data32S.length; j += 2) {
        var x = ci.data32S[j];
        var y = ci.data32S[j + 1];
        pairs.push({ x: x, y: y });
        diff.push(x - y);
        add.push(x + y);
    }
    points.push(pairs[findLowest(add)]);
    points.push(pairs[findLowest(diff)]);
    points.push(pairs[findMax(diff)]);
    points.push(pairs[findMax(add)]);
    return points;
}
exports.reorderContourToSquarePoints = reorderContourToSquarePoints;
function drawRectangle(frame, contourPoints, thickness) {
    cv.line(frame, contourPoints[0], contourPoints[1], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[1], contourPoints[3], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[3], contourPoints[2], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[2], contourPoints[0], [0, 255, 0, 255], thickness);
}
exports.drawRectangle = drawRectangle;
function findLowest(arr) {
    var lowest = Number.MAX_VALUE;
    var index = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < lowest) {
            lowest = arr[i];
            index = i;
        }
    }
    return index;
}
exports.findLowest = findLowest;
function findMax(arr) {
    var max = Number.MIN_VALUE;
    var index = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            index = i;
        }
    }
    return index;
}
exports.findMax = findMax;
function findBigestContour(imageCountours) {
    var biggestContour = undefined;
    var biggestContourArea = 0;
    for (var i = 0; i < imageCountours.size(); i++) {
        var contour = imageCountours.get(i);
        var contourArea = cv.contourArea(contour);
        if (contourArea > 5000) {
            var perimeter = cv.arcLength(contour, true);
            var approximation = new cv.Mat();
            cv.approxPolyDP(contour, approximation, 0.02 * perimeter, true);
            if (contourArea > biggestContourArea && approximation.rows === 4) {
                biggestContourArea = contourArea;
                biggestContour = approximation;
            }
        }
    }
    if (biggestContour) {
        var matVec = new cv.MatVector();
        matVec.push_back(biggestContour);
        biggestContour.delete();
        return matVec;
    }
    return biggestContour;
}
exports.findBigestContour = findBigestContour;
