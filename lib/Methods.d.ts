import { Point } from "./Utilities";
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
    contourColor?: {
        r: number;
        g: number;
        b: number;
    };
}
export declare const detect: ({ detectElement, showContours, drawRectangle, scanElement, resultElement, img, contourColor }: DetectProps) => void;
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
    contourColor?: {
        r: number;
        g: number;
        b: number;
    };
    onDetect?: (rectanglePoints: Point[]) => void;
}
interface DetectVideoReturnProps {
    stop: () => void;
}
export declare const detectVideo: ({ videoDisplayElement, showContours, drawRectangle, resultElement, onDetect, fps, img, contourColor, }: DetectVideoProps) => Promise<DetectVideoReturnProps>;
export {};
