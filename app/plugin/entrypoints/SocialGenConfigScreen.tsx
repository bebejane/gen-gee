import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Form, TextField, SelectField, Spinner } from 'datocms-react-ui';
import { useCallback, useEffect, useState } from 'react';

export type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function SocialGenConfigScreen({ ctx }: PropTypes) {

  const serverUrl = ctx.plugin.attributes.parameters.serverUrl as string;
  const [templates, setTemplates] = useState<any[] | undefined>()
  const [formValues, setFormValues] = useState<Partial<ConfigParameters>>(ctx.parameters);

  const saveParameter = useCallback((field: string, value: string | boolean) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
  }, [formValues, setFormValues, ctx]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${serverUrl}/api/template/list`)
        setTemplates(await res.json())
      } catch (err) {
        ctx.alert((err as Error).message)
      }
    })()
  }, [ctx, serverUrl])

  if (!templates)
    return <Canvas ctx={ctx}><Spinner /></Canvas>

  const templateOptions = templates.map(({ config: { id: value, name: label } }) => ({ label, value }))

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SelectField
          name="template"
          id="template"
          label="Template"
          value={templateOptions.find(t => t.value === formValues.templateId)}
          selectInputProps={{
            isMulti: false,
            options: templateOptions,
          }}
          onChange={(newValue) => {
            saveParameter('templateId', newValue?.value as string)
          }}
        />
        <TextField
          id="button-label"
          name="button-label"
          label="Button label"
          value={formValues.buttonLabel}
          onChange={(value) => saveParameter('buttonLabel', value)}
        />
      </Form>
    </Canvas>
  );
}