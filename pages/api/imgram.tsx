
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import template from '/templates/imgram.json'

const generateFont = async (name: string, format = { weight: 400, style: 'normal' }) => {
  console.log(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/${name}.woff`);

  return {
    name,
    data: await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/${name}.woff`).then(res => res.arrayBuffer()),
    ...format
  }
}

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
  let params: any = {}

  try {
    params = JSON.parse(req.nextUrl.searchParams.get('params'))
  } catch (err) {
    console.error(err);
  }

  const fonts = await Promise.all([
    'Dominicale-Alpha',
    'ProtokollBold-Web',
    'Helvetica'
  ].map((font) => generateFont(font)))

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
    ), {
    ...template.dimensions,
    fonts
  }
  );
}