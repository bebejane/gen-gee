
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import fontFiles from '/fonts.json'
import * as templates from '/templates'

export default async function handler(req: NextRequest, res: NextResponse) {
  let params: any = {}
  const fonts = await Promise.all(fontFiles.map(({ name }) => generateFont({ name })))
  const name = req.nextUrl.searchParams.get('template')

  try {
    if (req.nextUrl.searchParams.get('params'))
      params = JSON.parse(req.nextUrl.searchParams.get('params'))
  } catch (err) {
    console.error(err);
  }

  const Component = templates[Object.keys(templates).find(k => k.toLocaleLowerCase() === name.toLowerCase())]
  const template = Component.template
  const config = Component.config || defaultConfig

  Object.keys(template).forEach((k) => params[k] = {
    ...template[k],
    ...params[k]
  })

  return new ImageResponse(
    <Component {...params} />, {
    ...config.dimensions,
    fonts
  })
}

const defaultConfig = {
  "dimensions": {
    "width": 800,
    "height": 500
  }
}

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


export const config = {
  runtime: 'experimental-edge',
};