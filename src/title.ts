import canvas, { Canvas, CanvasRenderingContext2D } from "canvas";
import path from "node:path";

const FONT_STAATLICHES = path.join(
  __dirname,
  "../fonts/Staatliches-Regular.ttf"
);

canvas.registerFont(FONT_STAATLICHES, { family: "Staatliches" });

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Settings extends Size {
  slant: number;
  arrowOffset: Point;
  fgColour: string;
  bgColour: string;
  textColour: string;
}

const BannerSettings: Settings = {
  width: 640,
  height: 24,
  slant: 12,
  arrowOffset: {
    x: 72,
    y: 8,
  },
  fgColour: "#004287",
  bgColour: "#003865",
  textColour: "#ffffff",
};

function getPoints(settings: Settings): { bg: Point[][]; fg: Point[] } & Size {
  const height = settings.height + settings.arrowOffset.y * 2;
  const { width } = settings;

  const fg = [
    { x: 0, y: settings.arrowOffset.y },                        // topleft
    { x: width - settings.slant, y: settings.arrowOffset.y },   // topright
    { x: width, y: height - settings.arrowOffset.y },           // bottomright
    { x: settings.slant, y: height - settings.arrowOffset.y },  // bottomleft
  ];

  const bg = [
    [
      fg[0],
      fg[3],
      {
        x: fg[0].x + settings.arrowOffset.x,
        y: fg[0].y - settings.arrowOffset.y,
      },
    ],
    [
      fg[1],
      fg[2],
      {
        x: fg[2].x - settings.arrowOffset.x,
        y: fg[2].y + settings.arrowOffset.y,
      },
    ],
  ];

  return { width, height, fg, bg };
}

export function drawTitle(title: string) {
  const { width, height, bg, fg } = getPoints(BannerSettings);

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");

  // fill transparent
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0,0,width, height);

  // draw background
  ctx.fillStyle = BannerSettings.bgColour;
  createPath(ctx, ...bg[0]);
  ctx.fill();
  createPath(ctx, ...bg[1]);
  ctx.fill();

  // foreground
  ctx.fillStyle = BannerSettings.fgColour;
  createPath(ctx, ...fg);
  ctx.fill();

  // title
  ctx.fillStyle = BannerSettings.textColour;
  ctx.font = `${BannerSettings.height * 1.1}px Staatliches`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, width / 2, height * 0.5, width);

  // return image data
  return canvas.toBuffer("image/png");
}

function createPath(
  context: CanvasRenderingContext2D,
  ...points: { x: number; y: number }[]
): void {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
}
