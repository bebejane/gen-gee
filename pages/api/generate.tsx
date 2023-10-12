
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import * as templates from '/templates'
import fontFiles from '/fonts.json'
import { Base64 } from '/lib/utils';


export default async function handler(req: NextRequest, res: NextResponse): Promise<ImageResponse> {
  console.log('generate api handler');
  return new Response(
    JSON.stringify({ ok: searchParams.get('f') }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

  try {

    const { searchParams } = req.nextUrl
    const fonts = await Promise.all(fontFiles.map(({ name }) => generateFont({ name, })))
    console.log('loaded fonts', fonts);

    const Component = templates[Object.keys(templates).find(k => k.toLowerCase() === searchParams.get('t'))]
    const { config } = Component

    const styles = searchParams.get('s') ? Base64.decode(searchParams.get('s')) : Component.styles
    const fields = searchParams.get('f') ? Base64.decode(searchParams.get('f')) : {}
    const width = parseInt(searchParams.get('w') || config.width)
    const height = parseInt(searchParams.get('h') || config.height)
    //Object.keys(Component.styles).forEach((k) => styles[k] = { ...Component.styles[k], ...styles[k] })
    Object.keys(Component.config.fields).forEach((k) => fields[k] = { ...Component.config.fields[k], ...fields[k] })

    const values = Object.keys(fields).reduce((obj, k) => obj = { ...obj, [k]: fields[k].value }, {})
    const props = { styles, values, config: Component.config }

    console.log(`generate image ${width}x${height}`);

    return new ImageResponse(<Component {...props} />, {
      width,
      height,
      fonts
    })

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

const generateFont = async (opt: Omit<FontOption, 'data'>): Promise<FontOption> => {
  return {
    data: await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/${opt.name}.woff`).then(res => res.arrayBuffer()),
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
    responseLimit: false,
  },
};