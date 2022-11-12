
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import template from '/templates/imgram.json'

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