
import s from './ColorPicker.module.scss'
import { useRef, useEffect, useState } from 'react';
import { useWindowSize, useOutsideClick } from 'rooks';
import { HexColorPicker } from "react-colorful";
import ReactDOM from 'react-dom';

export type Props = {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color: colorFromProps, onChange }) {

  const ref = useRef<HTMLDivElement | null>(null)
  const refPicker = useRef<HTMLDivElement | undefined>()
  const [show, setShow] = useState(false)
  const [color, setColor] = useState(colorFromProps)
  const [pickerStyle, setPickerStyle] = useState<any | undefined>()
  const { innerWidth, innerHeight } = useWindowSize()

  useOutsideClick(refPicker, () => setShow(false));

  useEffect(() => {
    if (ref.current === null || refPicker.current === null)
      return

    const left = ref.current.getBoundingClientRect().left
    const top = ref.current.getBoundingClientRect().top - refPicker.current.getBoundingClientRect().height

    setPickerStyle({ left, top })
  }, [ref, refPicker, innerHeight, innerWidth, show])

  useEffect(() => {
    if (color !== colorFromProps)
      onChange(color)
  }, [color, colorFromProps, onChange])

  return (
    <div className={s.container} >
      <div className={s.color} onClick={() => setShow(!show)} style={{ backgroundColor: color }}></div>
      <div className={s.label} ref={ref} >{color}</div>
      {ReactDOM.createPortal(
        <div
          className={s.picker}
          style={{ ...pickerStyle, display: show ? 'block' : 'none' }}
          ref={refPicker}
        >
          <HexColorPicker onChange={(newColor) => setColor(newColor)} />
        </div>
        , document.body)}
    </div>
  );
}
