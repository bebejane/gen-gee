
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
    <div className={s.error} role="alert">
      <p>Error:</p>
      <pre>{error}</pre>
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
    const scaleHeight = (ref.current.clientHeight / config.height)
    const scaleWidth = (ref.current.clientWidth / config.width)
    const scale = isPortrait ? scaleHeight : scaleWidth
    setScale(Math.min(scale, Math.min(scaleHeight, scaleWidth)))

  }, [ref, innerWidth, innerHeight, config])

  const containerStyles = {
    height: `${config.height}px`,
    width: `${config.width}px`,
    maxHeight: `${config.height}px`,
    maxWidth: `${config.width}px`,
    transform: `scale(${scale})`,
    left: `${(ref.current?.clientWidth - (config.width * scale)) / 2}px`,
    top: `${(ref.current?.clientHeight - (config.height * scale)) / 2}px`,
  }

  Object.keys(Template.config.fields).forEach((k) => values[k] = values[k] !== undefined ? values[k] : Template.config.fields[k].value)

  return (
    <div className={s.wrap} ref={ref}>
      <div className={s.container} style={containerStyles}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Template styles={styles} values={values} config={config} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
