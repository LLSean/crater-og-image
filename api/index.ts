import { IncomingMessage, ServerResponse } from "http";

import { fabric } from "fabric";
const nodeCanvas = (fabric as any).nodeCanvas;

nodeCanvas.registerFont(__dirname + "/_fonts/BIZUDPGothic-Regular.ttf", {
  family: "BIZUDPGothic",
});

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  req;
  try {
    const width = 1200;
    const height = 630;

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
