import s from './SocialGenModal.module.scss'
import * as allTemplates from '/templates'
import TemplatePreview from '/components/TemplatePreview'
import { RenderModalCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Form, TextField, SelectField } from 'datocms-react-ui';
import { generateSourceUrl } from '../utils';
import { useState, useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import format from 'date-fns/format';
import Loader from "react-spinners/MoonLoader";

export type PropTypes = {
  ctx: RenderModalCtx;
};

export default function SocialGenModal({ ctx }: PropTypes) {

  const serverUrl = ctx.plugin.attributes.parameters.serverUrl as string
  const parameters = ctx.parameters as ConfigParameters & { fields: Fields | undefined }
  const { templateId } = parameters;
  const templateName = Object.keys(allTemplates).find((k) => allTemplates[k].config.id === templateId)
  const savedFields = { ...parameters.fields || {} }

  const [template, setTemplate] = useState<any | undefined>();
  const [src, setSrc] = useState<string | undefined>();
  const imageSrc = useDebounce<string | undefined>(src, 400)
  const [fields, setFields] = useState<Fields | undefined>();
  const [generating, setGenerating] = useState<boolean>(false);
  const dFields: Fields | undefined = useDebounce(fields, 400)

  const [loading, setLoading] = useState(true)

  const handleChange = (id: string, value: string) => {
    if (fields === undefined)
      return
    setFields({ ...fields, [id]: { ...fields[id], value } })
  }

  const handleSelectImage = async (id: string) => {
    const upload = await ctx.selectUpload({ multiple: false })

    if (!upload)
      return
    if (!upload.attributes.mime_type?.includes('image'))
      return ctx.alert('File is not an image!')

    const format = upload?.attributes.url.split('.').pop()
    handleChange(id, `${upload?.attributes.url}?fm=${format}`)
  }

  const handleDownload = async () => {
    setGenerating(true)
    const dateStr = format(new Date(), 'yyyy-MM-dd HH_mm')
    const filename = `${parameters.buttonLabel || 'Image'} (${dateStr}).png`
    const blob = await fetch(src as string).then(res => res.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setGenerating(false)
  }

  useEffect(() => {
    if (template === undefined || dFields === undefined)
      return

    const src = generateSourceUrl(serverUrl, template, { fields: dFields })

    setLoading(true)
    setSrc(src)

  }, [dFields, template, serverUrl])

  useEffect(() => {

    (async () => {
      try {
        const templates: any[] = await (await fetch(`${serverUrl}/api/template/list`)).json()
        const template = templates.find(t => t.config.id === templateId)

        if (!template)
          return ctx.alert(`Template "${templateId}" not found!"`)

        const mergedFields: Fields = {}

        Object.keys(template.config.fields).forEach((k) => {
          mergedFields[k] = { ...template.config.fields[k], ...parameters.fields?.[k] }
        })

        setTemplate(template)
        setFields(mergedFields)

      } catch (err) {
        ctx.alert((err as Error).message)
      }
    })()
  }, [templateId, setFields, ctx, parameters, serverUrl])

  const values = {}
  fields && Object.keys(fields).forEach((k) => values[k] = fields[k].value)


  return (
    <Canvas ctx={ctx}>
      <div className={s.modal}>
        <div className={s.editor}>
          <figure>
            <TemplatePreview name={templateName} values={values} />
          </figure>
          <div className={s.fields}>
            <Form>
              {fields && Object.keys(fields).map(id => {
                const { type, label, value, options } = fields[id]

                switch (type) {
                  case 'text':
                    return <TextField
                      id={id}
                      name={id}
                      label={label}
                      value={value}
                      onChange={(value) => handleChange(id, value)}
                    />
                  case 'textarea':
                    return (
                      <>
                        <label htmlFor={id}>{label}</label>
                        <textarea
                          id={id}
                          name={id}
                          value={value}
                          rows={5}
                          onChange={({ target: { value } }) => handleChange(id, value)}
                        />
                      </>
                    )
                  case 'image':
                    return (
                      <div className={s.imageSelector}>
                        <div>{value && <img alt="thumb" src={`${value}?w=50`} />}</div>
                        <Button onClick={() => handleSelectImage(id)}>Select image...</Button>
                      </div>
                    )
                  case 'select':
                    return (
                      <SelectField
                        id={id}
                        name={id}
                        label={label}
                        value={options?.find(o => o.value === fields[id].value)}
                        selectInputProps={{ isMulti: false, options }}
                        onChange={(newValue: any) => {
                          handleChange(id, newValue?.value as string)
                        }}
                      />
                    )
                  default:
                    return null;
                }
              })}
            </Form>
          </div>
        </div>
        <div className={s.buttons}>
          <Button fullWidth={true} onClick={handleDownload} disabled={loading}>
            {generating ? <>Preparing image....</> : <>Download</>}
          </Button>
          <Button
            fullWidth={true}
            onClick={() => ctx.resolve(fields)}
            disabled={!fields || JSON.stringify(savedFields) === JSON.stringify(fields)}
          >
            Save
          </Button>
        </div>
      </div>
    </Canvas>
  );
}