import { IncomingMessage, ServerResponse } from "http";
import { createCanvas, loadImage } from "canvas";
import drawText from "node-canvas-text";
import opentype from "opentype.js";
import { fabric } from "fabric";
const nodeCanvas = (fabric as any).nodeCanvas;
let regularFont = opentype.loadSync(
  __dirname + "/_fonts/BIZUDPGothic-Regular.ttf"
);

nodeCanvas.registerFont(__dirname + "/_fonts/BIZUDPGothic-Regular.ttf", {
  family: "BIZUDPGothic",
});

export default async function handler(
  // req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const data = {
      siteTitleImage:
        "https://storage.googleapis.com/crater/u/tg6nsg2lq50n3z2troyu7wtrkultl055_878x196.png",
      title:
        "ブラウザへのリアルタイム送信をやりたいとき、\nFirebaseとPusherどちらを使うか。",
      theme: "donut",
      baseColor: "#fecc16",
      baseContentColor: "#392e05",
      bgColor: "#fdfbf8",
      accentColor: "#185ca5",
      accentContentColor: "#f9f9fb",
      tags: ["日記", "美味しい", "技術", "React", "🐥ひよこ"],
      author: {
        image:
          "https://storage.googleapis.com/crater/u/hyo85d9ysk0en5u2p71ik3lnk5ws2mmq_221x221.png",
        name: "アノチック",
      },
    };

    const c = new fabric.StaticCanvas("c", {
      width: width,
      height: height,
      enableRetinaScaling: false,
    });

    const rect = new fabric.Rect({
      left: -(width / 2),
      top: -(height / 2),
      width: width * 2,
      height: height * 2,
      fill: data.baseColor,
    });

    c.add(rect);

    const rect2 = new fabric.Rect({
      left: 32,
      top: 128,
      width: width - 64,
      height: height - 128 - 32,
      rx: 32,
      ry: 32,
      fill: data.bgColor,
    });

    c.add(rect2);
    fabric.Image.fromURL(
      "https://storage.googleapis.com/crater/u/hyo85d9ysk0en5u2p71ik3lnk5ws2mmq_221x221.png",
      function (img) {
        img.scale(0.36).set({
          left: width - 32 - 96,
          top: 500,
          clipPath: new fabric.Circle({
            radius: 96,
            originX: "center",
            originY: "center",
          }),
        });
        c.add(img);
      }
    );
    var textbox = new fabric.Textbox(data.title, {
      left: 32,
      top: 128,
      width: width - 64,
      fontSize: 48,
      fontFamily: "BIZUDPGothic",
      textAlign: "center",
    });
    c.add(
      new fabric.Textbox(data.title, {
        left: 32,
        top: height / 2 + 48 - (textbox.height ?? 0) / 2,
        width: width - 64,
        fontSize: 48,
        fontFamily: "BIZUDPGothic",
        textAlign: "center",
      })
    );
    c.add(
      new fabric.Textbox(data.author.name, {
        left: 0,
        top: 524,
        width: width - 134,
        fontSize: 28,
        fontFamily: "BIZUDPGothic",
        textAlign: "right",
      })
    );
    // // Draw cat with lime helmet
    const titleImage = await loadImage(data.siteTitleImage);
    const authorImage = await loadImage(data.author.image);

    ctx.fillStyle = data.baseColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = data.bgColor;

    fillRoundRect(ctx, 32, 128, width - 64, height - 128 - 96, 32);
    const titleImageRatio = titleImage.width / titleImage.height;
    ctx.drawImage(titleImage, 32, 16, 96 * titleImageRatio, 96);
    ctx.save();
    roundedImage(ctx, width - 128, height - 128 - 64, 72, 72, 72 / 2);
    ctx.clip();
    ctx.drawImage(authorImage, width - 128, height - 128 - 64, 72, 72);
    ctx.restore();

    let drawRect = false;

    drawText(
      ctx,
      data.title,
      regularFont,
      {
        x: 64,
        y: 128 + 32,
        width: canvas.width - 128,
        height: canvas.height - 256 - 32,
      },
      {
        minSize: 5,
        maxSize: 64,
        vAlign: "center",
        hAlign: "center",
        fitMethod: "box",
        drawRect: drawRect,
      }
    );

    canvas.toDataURL("image/jpeg", 0.75);
    // const buffer = canvas.toBuffer();
    const base64Data = c
      .toDataURL({
        format: "png",
        quality: 1,
      })
      .replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
    // res.setHeader(
    //   "Cache-Control",
    //   `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    // );
    res.setHeader("Content-Length", buffer.length);

    res.end(buffer, "binary");
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

function createRoundRectPath(
  ctx: any,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, Math.PI * (3 / 2), 0, false);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1 / 2), false);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI * (1 / 2), Math.PI, false);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3 / 2), false);
  ctx.closePath();
}

/**
 * 角が丸い四角形を塗りつぶす
 * @param  {CanvasRenderingContext2D} ctx コンテキスト
 * @param  {Number} x   左上隅のX座標
 * @param  {Number} y   左上隅のY座標
 * @param  {Number} w   幅
 * @param  {Number} h   高さ
 * @param  {Number} r   半径
 */
function fillRoundRect(
  ctx: any,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  createRoundRectPath(ctx, x, y, w, h, r);
  ctx.fill();
}

/**
 * 角が丸い四角形を描画
 * @param  {CanvasRenderingContext2D} ctx コンテキスト
 * @param  {Number} x   左上隅のX座標
 * @param  {Number} y   左上隅のY座標
 * @param  {Number} w   幅
 * @param  {Number} h   高さ
 * @param  {Number} r   半径
 */

function roundedImage(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
