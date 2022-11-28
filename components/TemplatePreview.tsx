
import s from './TemplatePreview.module.scss'
import * as allTemplates from '/templates'
import { useRef, useEffect, useState } from 'react';
import { useWindowSize } from 'rooks';
import { ErrorBoundary } from 'react-error-boundary'


export type Props = {
  name: string
  values: any
}

const errorHandler = (error: Error, info: { componentStack: string }) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(error);

}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Error:</p>
      <pre>{error.message}</pre>
    </div>
  )
}
export default function TemplatePreview({ name, values }) {

  const [error, setError] = useState(false)

  const Template = allTemplates[name]
  const ref = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(0);
  const { innerWidth, innerHeight } = useWindowSize()
  const { config, styles } = Template

  useEffect(() => {
    const isPortrait = config.height > config.width
    setScale(isPortrait ? (ref.current.clientHeight / config.height) : (ref.current.clientWidth / config.width))
  }, [ref, innerWidth, innerHeight, config])

  const containerStyles = {
    height: `${config.height}px`,
    width: `${config.width}px`,
    maxHeight: `${config.height}px`,
    maxWidth: `${config.width}px`,
    transform: `scale(${scale})`,
  }

  Object.keys(Template.config.fields).forEach((k) => values[k] = values[k] !== undefined ? values[k] : Template.config.fields[k].value)

  return (
    <div className={s.wrap} ref={ref}>
      <div className={s.container} ref={ref} style={containerStyles}>
        <Template styles={styles} values={values} config={config} />
      </div>
    </div>
  );
}
