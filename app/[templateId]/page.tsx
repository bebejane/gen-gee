'use client'

import s from './page.module.scss'
import * as allTemplates from '/templates'
import TemplatePreview from '/components/TemplatePreview'
import ColorPicker from '/components/ColorPicker'
import { Base64, isValidFieldValue } from '/lib/utils';
import { useState } from 'react';

export async function generateStaticParams() {
  return Object.keys(allTemplates).map(k => {
    return { templateId: allTemplates[k].config.id }
  })
}

export default function Template({ params: { templateId } }) {

  const templateName = Object.keys(allTemplates).find((k) => allTemplates[k].config.id === templateId)
  const template = allTemplates[templateName]
  const [fields, setFields] = useState<undefined | Fields>(template?.config.fields)

  const updateField = (id: string, value: string) => {
    if (!isValidFieldValue(fields[id], value)) return console.log('not valid')

    setFields({ ...fields, [id]: { ...fields[id], value } });
  }

  const download = async () => {

    const src = `/api/generate?t=${templateId}&f=${Base64.encode(fields)}&r=${Math.random()}`
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

  if (!template)
    return null

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
                        <ColorPicker
                          color={fields[id].value}
                          onChange={(value) => updateField(id, value)}
                        />
                      )
                    case 'range':
                      return (
                        <input
                          type="range"
                          id={id}
                          value={fields[id].value}
                          min={fields[id].min}
                          max={fields[id].max}
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
        </div>
        <button onClick={download}>Download</button>
      </div>
    </div>
  )
}