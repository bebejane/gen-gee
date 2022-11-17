'use client'

import s from './page.module.scss'
import * as allTemplates from '/templates'
import { useRef, useEffect, useState } from 'react'
import { useKeys } from 'rooks'

export async function generateStaticParams() {
  return Object.keys(allTemplates).map(k => {
    return { templateId: allTemplates[k].template.name.id }
  })
}

export default function Template({ params: { templateId }, searchParams }) {

  const template = allTemplates[Object.keys(allTemplates).find((k) => allTemplates[k].template.id === templateId)]
  const [loading, setLoading] = useState(false)
  const [json, setJson] = useState<undefined | string>(JSON.stringify(template.styles, null, 2))
  const [valid, setValid] = useState(true)
  const [fields, setFields] = useState<undefined | any>(template?.template.fields)
  const [src, setSrc] = useState<undefined | string>();
  const jsonRef = useRef<HTMLTextAreaElement | null>(null)

  const handleJsonText = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key !== 'Tab')
      return

    evt.preventDefault();

    const target = evt.target as HTMLInputElement;
    const start = target.selectionStart === null ? target.value.length : target.selectionStart;
    const end = target.selectionEnd === null ? 0 : target.selectionEnd;
    target.value = target.value.substring(0, start) + "\t" + target.value.substring(end);
    target.selectionEnd = start + 1;
  }

  const update = () => {
    try {
      if (!json) return
      const styles = JSON.parse(json);
      setSrc(`/api/generate?t=${templateId}&s=${encodeURIComponent(JSON.stringify(styles))}&f=${encodeURIComponent(JSON.stringify(fields))}&r=${Math.random()}`)
    } catch (err) {
      alert('Not valid JSON!')
    }
  }
  useEffect(() => { update() }, [])

  useKeys(["Meta", "s"], (e) => {
    e.preventDefault()
    update()
  }, { when: true, preventLostKeyup: true });

  useEffect(() => {
    setLoading(src ? true : false)
  }, [src])

  useEffect(() => {
    if (!json) return

    try {
      JSON.parse(json);
      setValid(true)
    } catch (err) {
      setValid(false)
    }
  }, [json])

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={src} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
        {loading && <div className={s.loading}><div></div></div>}
      </div>
      <div className={s.template}>
        <div className={s.editor}>
          <textarea
            ref={jsonRef}
            value={json || ''}
            onKeyDown={handleJsonText}
            onChange={(e) => setJson(e.target.value)}
            className={!valid ? s.error : undefined}
          />
          <form>
            {fields && Object.keys(fields).map((k, idx) =>
              <div key={idx}>
                <label htmlFor={fields[k].id}>
                  <span>{fields[k].label}</span>
                  <span>{k}</span>
                </label>
                <input
                  type={"text"}
                  id={fields[k].id}
                  value={fields[k].value}
                  onChange={(e) => setFields({ ...fields, [k]: { ...fields[k], value: e.target.value } })}
                />
              </div>
            )}
          </form>
        </div>
        <button onClick={update}>Update (CMD + S)</button>
      </div>
    </div>
  )
}