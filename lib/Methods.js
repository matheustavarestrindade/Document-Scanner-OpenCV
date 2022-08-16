"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectVideo = exports.detect = void 0;
var Utilities_1 = require("./Utilities");
var detect = function (_a) {
    var detectElement = _a.detectElement, _b = _a.showContours, showContours = _b === void 0 ? false : _b, _c = _a.drawRectangle, drawRectangle = _c === void 0 ? false : _c, scanElement = _a.scanElement, resultElement = _a.resultElement, img = _a.img, contourColor = _a.contourColor;
    if (!img)
        img = { height: 640, width: 480 };
    var width = img.width, height = img.height;
    if (!contourColor)
        contourColor = { r: 255, g: 255, b: 255 };
    var r = contourColor.r, g = contourColor.g, b = contourColor.b;
    var frame = cv.imread(detectElement);
    var imageGray = new cv.Mat();
    cv.cvtColor(frame, imageGray, cv.COLOR_RGBA2GRAY);
    var imageBlur = new cv.Mat();
    cv.GaussianBlur(imageGray, imageBlur, { width: 5, height: 5 }, 0);
    var imageThreshold = new cv.Mat();
    cv.Canny(imageBlur, imageThreshold, 200, 255, 3, false);
    var imageDilated = new cv.Mat();
    cv.dilate(imageThreshold, imageDilated, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.erode(imageDilated, imageThreshold, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    var imageCountours = new cv.MatVector();
    var imageHierarchy = new cv.Mat();
    cv.findContours(imageThreshold, imageCountours, imageHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    var biggestContour = (0, Utilities_1.findBigestContour)(imageCountours);
    if (biggestContour) {
        if (showContours)
            cv.drawContours(frame, biggestContour, -1, [r, g, b, 0], 1);
        var rectanglePoints = (0, Utilities_1.reorderContourToSquarePoints)(biggestContour);
        var thickness = 2;
        if (rectanglePoints.length === 4) {
            if (drawRectangle)
                (0, Utilities_1.drawRectangle)(frame, rectanglePoints, thickness);
        }
    }
    cv.imshow(resultElement, frame);
    imageCountours.delete();
    imageHierarchy.delete();
    imageDilated.delete();
    imageThreshold.delete();
    imageBlur.delete();
    imageGray.delete();
    frame.delete();
};
exports.detect = detect;
var detectVideo = function (_a) {
    var videoDisplayElement = _a.videoDisplayElement, _b = _a.showContours, showContours = _b === void 0 ? false : _b, _c = _a.drawRectangle, drawRectangle = _c === void 0 ? false : _c, resultElement = _a.resultElement, onDetect = _a.onDetect, _d = _a.fps, fps = _d === void 0 ? 30 : _d, img = _a.img, contourColor = _a.contourColor;
    return __awaiter(void 0, void 0, void 0, function () {
        function processVideo() {
            var begin = Date.now();
            var copiedToResultFrame = false;
            if (stoped) {
                return;
            }
            capture.read(frame);
            cv.cvtColor(frame, imageGray, cv.COLOR_RGBA2GRAY);
            cv.GaussianBlur(imageGray, imageBlur, { width: 5, height: 5 }, 0);
            cv.Canny(imageBlur, imageThreshold, 200, 255, 3, false);
            cv.dilate(imageThreshold, imageDilated, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
            cv.erode(imageDilated, imageThreshold, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
            cv.findContours(imageThreshold, imageCountours, imageHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            biggestContour = (0, Utilities_1.findBigestContour)(imageCountours);
            if (biggestContour) {
                if (showContours)
                    cv.drawContours(frame, biggestContour, -1, [r, g, b, 0], 1);
                var rectanglePoints = (0, Utilities_1.reorderContourToSquarePoints)(biggestContour);
                var thickness = 2;
                if (rectanglePoints.length === 4) {
                    if (drawRectangle)
                        (0, Utilities_1.drawRectangle)(frame, rectanglePoints, thickness);
                    if (typeof onDetect === "function") {
                        onDetect(rectanglePoints);
                    }
                }
            }
            if (resultElement != undefined && !copiedToResultFrame)
                cv.imshow(resultElement, frame);
            var delay = 1000 / fps - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
        var width, height, r, g, b, videoStream, e_1, capture, frame, imageGray, imageBlur, imageThreshold, imageDilated, imageCountours, imageHierarchy, timeout, biggestContour, stoped;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!img)
                        img = { height: 640, width: 480 };
                    width = img.width, height = img.height;
                    if (!contourColor)
                        contourColor = { r: 255, g: 255, b: 255 };
                    r = contourColor.r, g = contourColor.g, b = contourColor.b;
                    if (!navigator.mediaDevices.getUserMedia)
                        throw new Error("getUserMedia is not supported");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true })];
                case 2:
                    videoStream = _e.sent();
                    if (videoStream === undefined)
                        throw new Error("videoStream is undefined");
                    videoDisplayElement.srcObject = videoStream;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _e.sent();
                    console.log("Error getting user media", e_1);
                    return [3 /*break*/, 4];
                case 4:
                    capture = new cv.VideoCapture(videoDisplayElement);
                    frame = new cv.Mat(videoDisplayElement.height, videoDisplayElement.width, cv.CV_8UC4);
                    imageGray = new cv.Mat();
                    imageBlur = new cv.Mat();
                    imageThreshold = new cv.Mat();
                    imageDilated = new cv.Mat();
                    imageCountours = new cv.MatVector();
                    imageHierarchy = new cv.Mat();
                    timeout = null;
                    stoped = false;
                    timeout = setTimeout(processVideo, 0);
                    return [2 /*return*/, {
                            stop: function () {
                                imageCountours.delete();
                                imageHierarchy.delete();
                                imageDilated.delete();
                                imageThreshold.delete();
                                imageBlur.delete();
                                imageGray.delete();
                                frame.delete();
                                videoStream.getTracks().forEach(function (track) { return track.stop(); });
                                timeout != null && clearTimeout(timeout);
                                stoped = true;
                            },
                        }];
            }
        });
    });
};
exports.detectVideo = detectVideo;
