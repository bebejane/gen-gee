
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import * as templates from '/templates'
import fontFiles from '/fonts.json'

export default async function handler(req: NextRequest, res: NextResponse) {

  try {
    const { searchParams } = req.nextUrl
    const fonts = await Promise.all(fontFiles.map(({ name }) => generateFont({ name, })))
    const Component = templates[Object.keys(templates).find(k => k.toLowerCase() === searchParams.get('t'))]
    const { template } = Component

    const styles = JSON.parse(searchParams.get('s') || '{}')
    const fields = JSON.parse(searchParams.get('f') || '{}')
    const width = parseInt(searchParams.get('w') || template.dimensions.width)
    const height = parseInt(searchParams.get('h') || template.dimensions.height)

    Object.keys(Component.styles).forEach((k) => styles[k] = { ...Component.styles[k], ...styles[k] })
    Object.keys(Component.template.fields).forEach((k) => fields[k] = { ...Component.template.fields[k], ...fields[k] })

    const props = { styles, fields }

    return new ImageResponse(<Component {...props} />, {
      width,
      height,
      fonts
    })

  } catch (err) {
    console.error(err)
    return new ImageResponse(
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        color: "red"
      }}>
        <h1>Error!</h1>
        {err.message}
      </div>,
      { width: 600, height: 400, status: 500 }
    )
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