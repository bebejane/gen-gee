import s from './SocialGenModal.module.scss'
import * as allTemplates from '/templates'
import TemplatePreview from '/components/TemplatePreview'
import ColorPicker from '/components/ColorPicker';
import { RenderModalCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Form, TextField, SelectField, Spinner } from 'datocms-react-ui';
import { generateSourceUrl } from '../utils';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'usehooks-ts';
import { isValidFieldValue } from '/lib/utils';
import { MoonLoader } from 'react-spinners'
import format from 'date-fns/format';

export type PropTypes = {
  ctx: RenderModalCtx;
};

export default function SocialGenModal({ ctx }: PropTypes) {

  const serverUrl = ctx.plugin.attributes.parameters.serverUrl as string
  const parameters = ctx.parameters as ConfigParameters & { values: any | undefined }
  const { templateId } = parameters;
  const templateName = Object.keys(allTemplates).find((k) => allTemplates[k].config.id === templateId)
  const savedValues = { ...parameters.values || {} }

  const ref = useRef<HTMLDivElement | undefined>()
  const [template, setTemplate] = useState<any | undefined>();
  const [src, setSrc] = useState<string | undefined>();
  const [fields, setFields] = useState<Fields | undefined>();
  const [generating, setGenerating] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const dFields: Fields | undefined = useDebounce(fields, 400)

  const handleChange = (id: string, value: string) => {
    if (fields === undefined) return
    if (!isValidFieldValue(fields[id], value))
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

    const images = ref.current?.querySelectorAll('img');
    let loaded = Array.from(images).filter(el => el.complete).length;
    if (loaded >= images.length)
      return

    setLoading(true)
    images.forEach(el => {
      el.addEventListener('load', () => ++loaded === images.length && setLoading(false))
    })
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

    setSrc(src)

  }, [dFields, template, serverUrl])

  useEffect(() => {

    (async () => {
      try {
        const templates: any[] = await (await fetch(`${serverUrl}/api/template/list`)).json()
        const template = templates.find(t => t.config.id === templateId)

        if (!template)
          return ctx.alert(`Template "${templateId}" not found!"`)

        const mergedFields: Fields = template.config.fields;

        Object.keys(parameters.values).forEach((k) => {
          mergedFields[k].value = parameters.values[k] !== undefined ? parameters.values[k] : mergedFields[k].value
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
      <div className={s.modal} ref={ref}>
        <div className={s.editor}>
          <figure>
            <TemplatePreview name={templateName} values={values} />
            {loading && <div className={s.loading}><MoonLoader /></div>}
          </figure>
          <div className={s.fields}>
            <Form>
              {fields && Object.keys(fields).map(id => {
                const { type, label, value, options } = fields[id]

                switch (type) {
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
                  case 'color':
                    return (
                      <>
                        <label htmlFor={id}>{label}</label>
                        <ColorPicker
                          color={value}
                          onChange={(value) => handleChange(id, value)}
                        />
                      </>
                    )
                  default:
                    return (

                      <TextField
                        id={id}
                        name={id}
                        label={label}
                        value={value}
                        onChange={(value) => handleChange(id, value)}
                      />

                    )
                }
              })}
            </Form>
          </div>
        </div>
        <div className={s.buttons}>
          <Button fullWidth={true} onClick={handleDownload}>
            {generating ? <Spinner /> : <>Download</>}
          </Button>
          <Button
            fullWidth={true}
            onClick={() => ctx.resolve(values)}
            disabled={!values || JSON.stringify(savedValues) === JSON.stringify(values)}
          >
            Save
          </Button>
        </div>
      </div>
    </Canvas>
  );
}