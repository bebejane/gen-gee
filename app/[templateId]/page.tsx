'use client'

import s from './page.module.scss'
import * as allTemplates from '/templates'
import TemplatePreview from '/components/TemplatePreview'
import { useRef, useEffect, useState } from 'react'
import { useKeys } from 'rooks'
import { Base64, isValidFieldValue } from '/lib/utils';

export async function generateStaticParams() {
  return Object.keys(allTemplates).map(k => {
    return { templateId: allTemplates[k].config.id }
  })
}

export default function Template({ params: { templateId } }) {

  const templateName = Object.keys(allTemplates).find((k) => allTemplates[k].config.id === templateId)
  const template = allTemplates[templateName]

  const [loading, setLoading] = useState(false)
  const [json, setJson] = useState<undefined | string>(JSON.stringify(template?.styles, null, 2))
  const [valid, setValid] = useState(true)
  const [fields, setFields] = useState<undefined | Fields>(template?.config.fields)
  const [src, setSrc] = useState<undefined | string>();
  const jsonRef = useRef<HTMLTextAreaElement | null>(null)

  const updateField = (id: string, value: string) => {
    if (!isValidFieldValue(fields[id], value)) return
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

      setSrc(`/api/generate?t=${templateId}&s=${Base64.encode(styles)}&f=${Base64.encode(fields)}&r=${Math.random()}`)
    } catch (err) {
      console.log(err);

      alert('Not valid JSON!')
    }
  }
  const download = async () => {


    const filename = `Image.png`
    const blob = await fetch(src as string).then(res => res.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

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


  if (!template) return null
  const values = {}
  Object.keys(template.config.fields).forEach(id => values[id] = fields[id].value || template.config.fields[id].value)

  return (
    <div className={s.container}>
      <div className={s.image}>
        <TemplatePreview
          name={templateName}
          values={values}
        />
      </div>
      <div className={s.template}>
        <div className={s.editor}>
          <form>
            {fields && Object.keys(fields).map((id, idx) =>
              <div key={idx}>
                <label htmlFor={id}>
                  <span>{fields[id].label}</span>
                  <span>{id}</span>
                </label>
                {(() => {
                  switch (fields[id].type) {
                    case 'select':
                      return (
                        <select value={fields[id].value} onChange={(e) => updateField(id, e.target.value)}>
                          {fields[id].options?.map(({ value, label }, idx) =>
                            <option key={idx} value={value}>{label}</option>
                          )}
                        </select>
                      )
                    case 'textarea':
                      return (
                        <textarea
                          rows={5}
                          onChange={(e) => updateField(id, e.target.value)} value={fields[id].value}
                        />
                      )
                    case 'image':
                      return (
                        <input
                          type="text"
                          id={id}
                          value={fields[id].value}
                          onChange={(e) => updateField(id, e.target.value)}
                        />
                      )
                    case 'number':
                      return (
                        <input
                          type="number"
                          id={id}
                          value={fields[id].value}
                          min={fields[id].min}
                          max={fields[id].max}
                          onChange={(e) => updateField(id, e.target.value)}
                        />
                      )
                    case 'color':
                      return (
                        <input
                          type="text"
                          id={id}
                          value={fields[id].value}
                          onChange={(e) => updateField(id, e.target.value)}
                        />
                      )
                    default:
                      return (
                        <input
                          type="text"
                          id={id}
                          value={fields[id].value}
                          onChange={(e) => updateField(id, e.target.value)}
                        />
                      )
                  }
                })()}
              </div>
            )}
          </form>
          {/*
          <textarea
            ref={jsonRef}
            value={json || ''}
            onKeyDown={handleJsonText}
            onChange={(e) => setJson(e.target.value)}
            className={!valid ? s.error : undefined}
          />
              */}
        </div>
        <button onClick={download}>Download</button>
      </div>
    </div>
  )
}