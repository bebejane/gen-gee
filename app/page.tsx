'use client'

import Link from 'next/link'
import s from './page.module.scss'
import * as allTemplates from '/templates'

export default function Home() {

  const templates = Object.keys(allTemplates).map(k => allTemplates[k].template)

  return (
    <div className={s.container}>
      <h1>Templates</h1>
      <ul>
        {templates.map(({ id, name }, idx) =>
          <Link key={idx} href={`/${id}`}>
            {name}
          </Link>
        )}
      </ul>
    </div>
  )
}