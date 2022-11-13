
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import template from '/templates/imgram.json'
import fontFiles from '/fonts.json'

export type FontOption = {
  name: string,
  data: ArrayBuffer,
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  style?: 'normal' | 'italic'
}

const generateFont = async (opt: Omit<FontOption, 'data'>): Promise<FontOption> => {

  return {
    data: await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/${opt.name}.woff`).then(res => res.arrayBuffer()),
    ...opt
  }
}

export default async function handler(req: NextRequest, res: NextResponse) {
  let params: any = {}

  try {
    params = JSON.parse(req.nextUrl.searchParams.get('params'))
  } catch (err) {
    console.error(err);
  }

  const fonts = await Promise.all(fontFiles.map(({ name }) => generateFont({ name })))

  Object.keys(template).forEach((k) => params[k] = { ...template[k], ...params[k] })

  return new ImageResponse((
    <div style={{ ...params.container }}>
      <img
        style={{ ...params.image }}
        src={`${process.env.NEXT_PUBLIC_SITE_URL}${params.image?.url}`}
      />
      <div style={{ ...params.text }}>
        <h1 style={{ ...params.header }}>{params.header?.value || ''}</h1>
        <span>
          {params.text?.value || ''}
        </span>
      </div>
    </div>
  ), {
    ...template.dimensions,
    fonts
  })
}

export const config = {
  runtime: 'experimental-edge',
};
