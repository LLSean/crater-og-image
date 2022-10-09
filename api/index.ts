import { IncomingMessage, ServerResponse } from "http";

import { fabric } from "fabric";
function loadImage(url: string): Promise<fabric.Image> {
  return new Promise((resolve) => {
    fabric.Image.fromURL(url, function (img) {
      resolve(img);
    });
  });
}

const nodeCanvas = (fabric as any).nodeCanvas;

nodeCanvas.registerFont(__dirname + "/_fonts/BIZUDPGothic-Regular.ttf", {
  family: "BIZUDPGothic",
});
nodeCanvas.registerFont(__dirname + "/_fonts/BIZUDPGothic-Bold.ttf", {
  family: "BIZUDPGothicBold",
});

type Input = {
  theme: "donut" | "basic" | "material";
  siteTitle: {
    type: "text" | "image";
    data: string;
  };
  pageTitle: string;
  colors: {
    [key: string]: string;
  };
  category: string | null;
  tags: string[];
  author: {
    name: string;
    image: string;
  } | null;
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  req;
  try {
    const width = 1200;
    const height = 630;

    const data: Input = {
      siteTitle: {
        type: "image",
        data: "https://storage.googleapis.com/crater/u/tg6nsg2lq50n3z2troyu7wtrkultl055_878x196.png",
      },
      pageTitle:
        "ブラウザへのリアルタイム送信をやりたいとき、\nFirebaseとPusherどちらを使うか。",
      theme: "donut",
      colors: {
        baseColor: "#fecc16",
        baseContentColor: "#392e05",
        bgColor: "#fdfbf8",
        bgContentColor: "#2e577b",
        accentColor: "#185ca5",
        accentContentColor: "#f9f9fb",
      },
      category: "技術",
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
      fill: data.colors.baseColor,
    });

    c.add(rect);

    const rect2 = new fabric.Rect({
      left: 32,
      top: 128,
      width: width - 64,
      height: height - 128 - 32,
      rx: 32,
      ry: 32,
      fill: data.colors.bgColor,
    });

    c.add(rect2);

    if (data.siteTitle.type == "text") {
      c.add(
        new fabric.Textbox(data.siteTitle.data, {
          fill: data.colors.baseContentColor,
          left: 40,
          top: 40,
          fontSize: 50,
          fontFamily: "BIZUDPGothicBold",
          textAlign: "left",
        })
      );
    } else {
      const titleImage = await loadImage(data.siteTitle.data);
      titleImage.scale(130 / (titleImage.height ?? 1)).set({
        left: 32,
      });
      c.add(titleImage);
    }
    if (data.author) {
      const authorIconImg = await loadImage(data.author.image);

      authorIconImg.scale(0.36).set({
        left: width - 32 - 96,
        top: 500,
        clipPath: new fabric.Circle({
          radius: 96,
          originX: "center",
          originY: "center",
        }),
      });
      c.add(authorIconImg);
      c.add(
        new fabric.Textbox(data.author.name, {
          left: 0,
          top: 524,
          width: width - 134,
          fontSize: 28,
          fill: data.colors.bgContentColor,

          fontFamily: "BIZUDPGothicBold",
          textAlign: "right",
        })
      );
    }

    var textbox = new fabric.Textbox(data.pageTitle, {
      left: 32,
      top: 128,
      width: width - 64,
      fontSize: 48,
      fontFamily: "BIZUDPGothicBold",
      textAlign: "center",
    });
    c.add(
      new fabric.Textbox(data.pageTitle, {
        left: 32,
        top: height / 2 + 48 - (textbox.height ?? 0) / 2,
        width: width - 64,
        fontSize: 48,
        fontFamily: "BIZUDPGothicBold",
        fill: data.colors.bgContentColor,

        textAlign: "center",
      })
    );

    if (data.category) {
      const catText = new fabric.Textbox(data.category, {
        left: width - 200,
        top: 16,
        fontSize: 32,
        padding: 32,
        fontFamily: "BIZUDPGothicBold",
        fill: data.colors.accentContentColor,

        textAlign: "left",
      });

      catText.set({
        left: width - (catText.width ?? 0) - 16,
      });
      const catBg = new fabric.Rect({
        left: width - (catText.width ?? 0) - 32,
        top: -1,
        width: (catText.width ?? 0) + 32,
        height: (catText.height ?? 0) + 32,
        rx: 16,
        fill: data.colors.accentColor,
      });
      c.add(catBg);
      const catBgR1 = new fabric.Rect({
        left: width - (catText.width ?? 0) - 32,
        top: -1,
        width: (catText.width ?? 0) + 32,
        height: catText.height ?? 0,
        fill: data.colors.accentColor,
      });
      c.add(catBgR1);
      const catBgR2 = new fabric.Rect({
        left: width - (catText.width ?? 0),
        top: -1,
        width: (catText.width ?? 0) + 32,
        height: (catText.height ?? 0) + 32,
        fill: data.colors.accentColor,
      });
      c.add(catBgR2);
      c.add(catText);
    }

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
