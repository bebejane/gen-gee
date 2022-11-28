
import s from './TemplatePreview.module.scss'
import * as allTemplates from '/templates'
import { useRef, useEffect, useState } from 'react';
import { useWindowSize } from 'rooks';

export type Props = {
  name: string
  values: any
}

export default function TemplatePreview({ name, values }) {

  const ref = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(0);
  const { innerWidth, innerHeight } = useWindowSize()
  const Template = allTemplates[name]
  const { config, styles } = Template

  useEffect(() => {
    const isPortrait = config.height > config.width
    setScale(isPortrait ? (ref.current.clientHeight / config.height) : (ref.current.clientWidth / config.width))
  }, [ref, innerWidth, innerHeight, config])

  const wrapStyles = {


  }

  const containerStyles = {
    height: `${config.height}px`,
    width: `${config.width}px`,
    maxHeight: `${config.height}px`,
    maxWidth: `${config.width}px`,
    transform: `scale(${scale})`,
  }

  return (
    <div className={s.wrap} style={wrapStyles} ref={ref}>
      <div className={s.container} ref={ref} style={containerStyles}>
        <Template styles={styles} values={values} config={config} />
      </div>
    </div>
  );
}
