
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

const template = {
  "container": {
    "position": "relative",
    "width": "100%",
    "height": "100%",
    "display": "flex",
    "flexDirection": "column",
    "textAlign": "left",
    "alignItems": "flex-start",
    "justifyContent": "center"
  },
  "header": {
    "textAlign": "left",
    "fontSize": "100px",
    "fontWeight": "bold",
    "value": "Logga in?"
  },
  "text": {
    "position": "absolute",
    "top:": 0,
    "left:": 0,
    "zIndex": 3,
    "fontSize": "40px",
    "color": "#FFFFFF",
    "background": "transparent",
    "width": "100%",
    "height": "100%",
    "display": "flex",
    "lineHeight": 1,
    "flexDirection": "column",
    "textAlign": "left",
    "alignItems": "flex-start",
    "justifyContent": "center",
    "transform": "rotate(0deg)",
    "value": "nej jag vill inte!",
    "padding": "20px"
  },
  "image": {
    "position": "absolute",
    "top:": 0,
    "left:": 0,
    "zIndex": 2,
    "width": "100%",
    "height": "100%",
    "objectFit": "cover",
    "url": "/images/image1.jpg"
  },
  "dimensions": {
    "width": 800,
    "height": 500
  }
}


export const config = {
  runtime: 'experimental-edge',
};

export default function handler(req: NextRequest, res: NextResponse) {
  let params: any = {}

  try {
    params = JSON.parse(req.nextUrl.searchParams.get('params'))
  } catch (err) {
    console.error(err);
  }

  Object.keys(template).forEach((k) => params[k] = { ...template[k], ...params[k] })

  return new ImageResponse(
    (
      <div style={{ ...params.container }}>
        <img
          style={{ ...params.image }}
          src={`${process.env.NEXT_PUBLIC_SITE_URL}${params.image?.url}`}
        />
        <div style={{ ...params.text }}>
          <h1 style={{ ...params.header }}>{params.header?.value}</h1>
          <span>
            {params.text?.value}
          </span>
        </div>
      </div>
    ), { ...template.dimensions }
  );
}