import { drawRectangle as drawRect, findBigestContour, findLowest, findMax, Point, reorderContourToSquarePoints, wrapImage } from "./Utilities";

interface DetectProps {
    detectElement: HTMLImageElement | HTMLCanvasElement;
    scanElement?: HTMLCanvasElement;
    resultElement: HTMLCanvasElement;
    drawRectangle?: boolean;
    showContours?: boolean;
    img?: {
        height: number;
        width: number;
    };
    contourColor?: { r: number; g: number; b: number };
}

export const detect = ({ detectElement, showContours = false, drawRectangle = false, scanElement, resultElement, img, contourColor }: DetectProps) => {
    if (!img) img = { height: 640, width: 480 };
    const { width, height } = img;
    if (!contourColor) contourColor = { r: 255, g: 255, b: 255 };
    const { r, g, b } = contourColor;
    let frame = cv.imread(detectElement);
    let imageGray = new cv.Mat();

    cv.cvtColor(frame, imageGray, cv.COLOR_RGBA2GRAY);
    let imageBlur = new cv.Mat();
    cv.GaussianBlur(imageGray, imageBlur, { width: 5, height: 5 }, 0);
    let imageThreshold = new cv.Mat();
    cv.Canny(imageBlur, imageThreshold, 200, 255, 3, false);
    let imageDilated = new cv.Mat();
    cv.dilate(imageThreshold, imageDilated, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.erode(imageDilated, imageThreshold, cv.Mat.ones(5, 5, cv.CV_8U), { x: -1, y: -1 }, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    let imageCountours = new cv.MatVector();
    let imageHierarchy = new cv.Mat();
    cv.findContours(imageThreshold, imageCountours, imageHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let biggestContour = findBigestContour(imageCountours);
    if (biggestContour) {
        if (showContours) cv.drawContours(frame, biggestContour, -1, [r, g, b, 0], 1);
        const rectanglePoints = reorderContourToSquarePoints(biggestContour);
        const thickness = 2;
        if (rectanglePoints.length === 4) {
            if (drawRectangle) drawRect(frame, rectanglePoints, thickness);
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

interface DetectVideoProps {
    videoDisplayElement: HTMLVideoElement;
    resultElement?: HTMLCanvasElement;
    drawRectangle?: boolean;
    showContours?: boolean;
    fps?: number;
    img?: {
        height: number;
        width: number;
    };
    contourColor?: { r: number; g: number; b: number };
    onDetect?: (rectanglePoints: Point[]) => void;
}
interface DetectVideoReturnProps {
    stop: () => void;
}

export const detectVideo = async ({
    videoDisplayElement,
    showContours = false,
    drawRectangle = false,
    resultElement,
    onDetect,
    fps = 30,
    img,
    contourColor,
}: DetectVideoProps): Promise<DetectVideoReturnProps> => {
    if (!img) img = { height: 640, width: 480 };
    const { width, height } = img;
    if (!contourColor) contourColor = { r: 255, g: 255, b: 255 };
    const { r, g, b } = contourColor;
    if (!navigator.mediaDevices.getUserMedia) throw new Error("getUserMedia is not supported");
    let videoStream: MediaStream;
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoStream === undefined) throw new Error("videoStream is undefined");
        videoDisplayElement.srcObject = videoStream;
    } catch (e) {
        console.log("Error getting user media", e);
    }

    const capture = new cv.VideoCapture(videoDisplayElement);

    let frame = new cv.Mat(videoDisplayElement.height, videoDisplayElement.width, cv.CV_8UC4);
    let imageGray = new cv.Mat();
    let imageBlur = new cv.Mat();
    let imageThreshold = new cv.Mat();
    let imageDilated = new cv.Mat();
    let imageCountours = new cv.MatVector();
    let imageHierarchy = new cv.Mat();
    let timeout: null | ReturnType<typeof setTimeout> = null;
    let biggestContour: any | undefined;
    let stoped = false;

    function processVideo() {
        let begin = Date.now();
        let copiedToResultFrame = false;

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

        biggestContour = findBigestContour(imageCountours);
        if (biggestContour) {
            if (showContours) cv.drawContours(frame, biggestContour, -1, [r, g, b, 0], 1);
            const rectanglePoints = reorderContourToSquarePoints(biggestContour);
            const thickness = 2;
            if (rectanglePoints.length === 4) {
                onDetect && onDetect(rectanglePoints);
                if (drawRectangle) drawRect(frame, rectanglePoints, thickness);
            }
        }

        if (resultElement != undefined && !copiedToResultFrame) cv.imshow(resultElement, frame);
        let delay = 1000 / fps - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }

    timeout = setTimeout(processVideo, 0);

    return {
        stop: () => {
            imageCountours.delete();
            imageHierarchy.delete();
            imageDilated.delete();
            imageThreshold.delete();
            imageBlur.delete();
            imageGray.delete();
            frame.delete();
            videoStream.getTracks().forEach((track) => track.stop());
            timeout != null && clearTimeout(timeout);
            stoped = true;
        },
    };
};
