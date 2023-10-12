import * as allTemplates from '/templates'
import Template from '/app/[templateId]/Template';

export async function generateStaticParams() {
  return Object.keys(allTemplates).map(k => {
    return { templateId: allTemplates[k].config.id }
  })
}

export default function TemplatePage({ params: { templateId } }) {
  return <Template params={{ templateId }} />
}