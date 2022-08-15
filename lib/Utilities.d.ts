export interface Point {
    x: number;
    y: number;
}
export declare function wrapImage(frame: any, dst: any, imagePoints: Point[], width: number, height: number): void;
export declare function reorderContourToSquarePoints(contours: any): Point[];
export declare function drawRectangle(frame: any, contourPoints: {
    x: number;
    y: number;
}[], thickness: number): void;
export declare function findLowest(arr: number[]): number;
export declare function findMax(arr: number[]): number;
export declare function findBigestContour(imageCountours: any): any;
