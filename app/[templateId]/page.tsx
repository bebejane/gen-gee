'use client'

import s from './page.module.scss'
import * as allTemplates from '/templates'
import { useRef, useEffect, useState } from 'react'
import { useKeys } from 'rooks'

export async function generateStaticParams() {
  return Object.keys(allTemplates).map(k => {
    return { templateId: allTemplates[k].config.id }
  })
}

export default function Template({ params: { templateId } }) {

  const template = allTemplates[Object.keys(allTemplates).find((k) => allTemplates[k].config.id === templateId)]
  const [loading, setLoading] = useState(false)
  const [json, setJson] = useState<undefined | string>(JSON.stringify(template?.styles, null, 2))
  const [valid, setValid] = useState(true)
  const [fields, setFields] = useState<undefined | any>(template?.config.fields)
  const [src, setSrc] = useState<undefined | string>();
  const jsonRef = useRef<HTMLTextAreaElement | null>(null)

  const updateField = (id: string, value: string) => {
    setFields({ ...fields, [id]: { ...fields[id], value } });
  }

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
      console.log(JSON.parse(atob(btoa(JSON.stringify(styles, null)))));
      //console.log(JSON.stringify(styles, 'base64'));


      setSrc(`/api/generate?t=${templateId}&s=${btoa(JSON.stringify(styles))}&f=${btoa(JSON.stringify(fields))}&r=${Math.random()}`)
    } catch (err) {
      console.log(err);

      alert('Not valid JSON!')
    }
  }

  useEffect(() => { update() }, [])

  useKeys(["MetaLeft", "s"], (e) => {
    e.preventDefault()
    update()
  }, { when: true, preventLostKeyup: true });

  useKeys(["MetaRight", "s"], (e) => {
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
          <form>
            {fields && Object.keys(fields).map((k, idx) =>
              <div key={idx}>
                <label htmlFor={fields[k].id}>
                  <span>{fields[k].label}</span>
                  <span>{k}</span>
                </label>
                {(() => {
                  switch (fields[k].type) {
                    case 'select':
                      return (
                        <select value={fields[k].value} onChange={(e) => updateField(k, e.target.value)}>
                          {fields[k].options?.map(({ value, label }, idx) =>
                            <option key={idx} value={value}>{label}</option>
                          )}
                        </select>
                      )
                    case 'textarea':
                      return (
                        <textarea
                          rows={5}
                          onChange={(e) => updateField(k, e.target.value)} value={fields[k].value}
                        />
                      )
                    default:
                      return (
                        <input
                          type={"text"}
                          id={fields[k].id}
                          value={fields[k].value}
                          onChange={(e) => updateField(k, e.target.value)}
                        />
                      )
                  }
                })()}
              </div>
            )}
          </form>
          <textarea
            ref={jsonRef}
            value={json || ''}
            onKeyDown={handleJsonText}
            onChange={(e) => setJson(e.target.value)}
            className={!valid ? s.error : undefined}
          />
        </div>
        <button onClick={update}>Update (CMD + S)</button>
      </div>
    </div>
  )
}