
import { NextRequest, NextResponse } from 'next/server';
import * as templates from '/templates'

export default async function handler(req: NextRequest, res: NextResponse) {
  const allTemplates = Object.keys(templates).map(k => ({ config: templates[k].config, styles: templates[k].styles }))

  return new Response(
    JSON.stringify(allTemplates),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}

export const config = {
  runtime: 'experimental-edge',
};