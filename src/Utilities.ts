export interface Point {
    x: number;
    y: number;
}

export function reorderContourToSquarePoints(contours: any): Point[] {
    const points: Point[] = [];
    const add: number[] = [];
    const diff: number[] = [];

    const ci = contours.get(0);
    const pairs: Point[] = [];
    for (let j = 0; j < ci.data32S.length; j += 2) {
        const x = ci.data32S[j];
        const y = ci.data32S[j + 1];
        pairs.push({ x, y });
        diff.push(x - y);
        add.push(x + y);
    }

    points.push(pairs[findLowest(add)]);
    points.push(pairs[findLowest(diff)]);
    points.push(pairs[findMax(diff)]);
    points.push(pairs[findMax(add)]);
    return points;
}

export function drawRectangle(frame: any, contourPoints: { x: number; y: number }[], thickness: number) {
    cv.line(frame, contourPoints[0], contourPoints[1], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[1], contourPoints[3], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[3], contourPoints[2], [0, 255, 0, 255], thickness);
    cv.line(frame, contourPoints[2], contourPoints[0], [0, 255, 0, 255], thickness);
}

export function findLowest(arr: number[]): number {
    let lowest = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < lowest) {
            lowest = arr[i];
            index = i;
        }
    }
    return index;
}

export function findMax(arr: number[]): number {
    let max = Number.MIN_VALUE;
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            index = i;
        }
    }
    return index;
}

export function findBigestContour(imageCountours: any) {
    let biggestContour: any = undefined;
    let biggestContourArea = 0;
    for (let i = 0; i < imageCountours.size(); i++) {
        let contour = imageCountours.get(i);
        let contourArea = cv.contourArea(contour);
        if (contourArea > 5000) {
            let perimeter = cv.arcLength(contour, true);
            let approximation = new cv.Mat();
            cv.approxPolyDP(contour, approximation, 0.02 * perimeter, true);
            if (contourArea > biggestContourArea && approximation.rows === 4) {
                biggestContourArea = contourArea;
                biggestContour = approximation;
            }
        }
    }
    if (biggestContour) {
        let matVec = new cv.MatVector();
        matVec.push_back(biggestContour);
        biggestContour.delete();
        return matVec;
    }

    return biggestContour;
}
