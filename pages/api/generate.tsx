
import { NextRequest, NextResponse, ImageResponse } from 'next/server';

import * as templates from '/templates'
import fontFiles from '/fonts.json'
import { Base64 } from '/lib/utils';

export default async function handler(req: NextRequest, res: NextResponse): Promise<ImageResponse> {
  console.log('generate api handler');
  const { searchParams } = req.nextUrl

  const mock = new Response(
    JSON.stringify({ f: searchParams.get('f'), s: searchParams.get('s'), t: searchParams.get('t') }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

  try {


    const fonts = await Promise.all(fontFiles.map(({ name, weight, style }) => generateFont({ name, weight, style })))
    console.log('loaded fonts', fonts);


    const idx = Object.keys(templates).find(k => k.toLowerCase() === searchParams.get('t'))

    if (idx === undefined) throw new Error('Template not found')

    const Component = templates[idx]
    const { config } = Component

    const s = searchParams.get('s')
    const f = searchParams.get('f')
    const styles = s ? Base64.decode(s) : Component.styles
    const fields = f ? Base64.decode(f) : {}
    const width = parseInt(searchParams.get('w') || config.width)
    const height = parseInt(searchParams.get('h') || config.height)

    Object.keys(Component.config.fields).forEach((k) => fields[k] = { ...Component.config.fields[k], ...fields[k] })

    const values = Object.keys(fields).reduce((obj, k) => obj = { ...obj, [k]: fields[k].value }, {})
    const props = { styles, values, config: Component.config }

    console.log(`generate image ${width}x${height}`);
    //console.log(props);
    //return mock
    const image = new ImageResponse(<Component {...props} />, {
      width,
      height,
      fonts
    })

    //console.log(fonts[0].data.byteLength)

    return image

  } catch (err) {
    console.log('error')
    console.log(err)
    return errorResponse(err)
  }
}

export type FontOption = {
  name: string,
  data: ArrayBuffer,
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  style?: 'normal' | 'italic'
}

const generateFont = async (opt: any): Promise<FontOption> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/${opt.name}.woff`)
  const data = await res.arrayBuffer()
  return {
    data,
    ...opt
  }
}

const errorResponse = (err: Error) => {

  return new ImageResponse(
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",
      color: "red"
    }}>
      <h1>Error!</h1>
      {err.message}
    </div>,
    { width: 600, height: 400, status: 500 }
  )
}

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '20mb',
  },
};