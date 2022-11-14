'use client'

import s from './page.module.scss'
import * as templates from '/templates'
import { useRef, useEffect, useState } from 'react'
import { useKeys } from 'rooks'

export default function Home() {

  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState<string | undefined>()
  const [json, setJson] = useState<undefined | string>()
  const [valid, setValid] = useState(true)
  const [params, setParams] = useState<undefined | string>()
  const [src, setSrc] = useState<undefined | string>();
  const jsonRef = useRef<HTMLTextAreaElement | null>(null)

  const updateParams = (str: string) => {
    try {
      const params = JSON.parse(str)
      setParams(str)
    } catch (err) {
      alert('Not valid JSON!')
    }
  }

  useKeys(["Meta", "s"], (e) => {
    e.preventDefault()
    updateParams(json)
  }, { when: true, preventLostKeyup: true });

  useEffect(() => {
    const data = JSON.stringify(templates[template]?.template, null, 2)
    setJson(data)
    setParams(data)
  }, [template])

  useEffect(() => {
    if (!template) return
    setSrc(`/api/gengee?template=${template}&params=${encodeURIComponent(params)}&r=${Math.random()}`)
  }, [setSrc, template, params])

  useEffect(() => {
    if (src)
      setLoading(true)
  }, [src])
  useEffect(() => {
    if (!json) return
    try { JSON.parse(json); setValid(true) } catch (err) { setValid(false) }
  }, [json])

  useEffect(() => {
    if (typeof jsonRef.current === 'undefined')
      return

    jsonRef.current.addEventListener('keydown', (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== 'Tab')
        return

      e.preventDefault();
      const { target } = e;
      const s = target.selectionStart;
      target.value = target.value.substring(0, target.selectionStart) + "\t" + target.value.substring(target.selectionEnd);
      target.selectionEnd = s + 1;
    });
  }, [])

  return (
    <div className={s.container}>

      <div className={s.image}>
        {template &&
          <img src={src} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
        }
        {loading &&
          <div className={s.loading}><div></div></div>
        }
      </div>

      <div className={s.template}>
        <select onChange={({ target: { value } }) => setTemplate(value === '-1' ? undefined : value)}>
          <option value={'-1'}>Select Template</option>
          {Object.keys(templates).map((name, idx) =>
            <option key={idx} value={name}>{name}</option>
          )}
        </select>
        <textarea
          ref={jsonRef}
          value={json || ''}
          onChange={(e) => setJson(e.target.value)}
          className={!valid ? s.error : undefined}
        />
        <button onClick={() => updateParams(json)}>Save</button>
      </div>

    </div>
  )
}