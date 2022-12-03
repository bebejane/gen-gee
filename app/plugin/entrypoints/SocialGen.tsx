import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function SocialGen({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters;
  const { templateId, buttonLabel } = parameters
  const serverUrl = ctx.plugin.attributes.parameters.serverUrl;

  const handleOpenModal = async () => {
    try {

      if (!templateId || !buttonLabel || !serverUrl)
        throw new Error('Plugin not configured correctly!');

      const savedValues = ctx.item?.attributes[ctx.field.attributes.api_key] as string
      const values = savedValues ? JSON.parse(savedValues) : undefined

      const result = await ctx.openModal({
        id: 'socialGenModal',
        title: 'Social image',
        width: 'xl',
        closeDisabled: false,
        parameters: { ...parameters, values }
      });

      if (result)
        ctx.setFieldValue(ctx.field.attributes.api_key, JSON.stringify(result))

    } catch (err) {
      ctx.alert((err as Error).message)
    }
  }

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={handleOpenModal}>
        {buttonLabel || 'Generate image...'}
      </Button>
    </Canvas>
  );
}