import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, TextField, Button, Form } from 'datocms-react-ui';
import { useState } from 'react';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {

  const parameters = ctx.plugin.attributes.parameters;
  const [formValues, setFormValues] = useState<any>({ ...parameters })

  const saveSettings = () => {
    ctx.updatePluginParameters({ ...formValues })
    ctx.notice('Settings updated successfully!');
  }

  const hasChanged = JSON.stringify(parameters) !== JSON.stringify(formValues)

  return (
    <Canvas ctx={ctx}>
      <p>Social-Gen plugin</p>
      <Form>
        <TextField
          id="serverUrl"
          name="serverUrl"
          label="Server URL"
          value={formValues.serverUrl}
          onChange={(serverUrl) => setFormValues({ ...formValues, serverUrl })}
        />
        <Button onClick={saveSettings} fullWidth disabled={!hasChanged}>Save settings</Button>
      </Form>
    </Canvas>
  );
}
