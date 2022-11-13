import { useState } from 'react'
import s from './index.module.scss'
import React from 'react'
import { useDebounce, useFetch } from 'usehooks-ts'
import { useEffect } from 'react'
import template from '/templates/imgram.json'

const images = ['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg']
const colors = ['#ffffff', '#000000', '#7fffd4', '#ff7fc3']

const inputProps = ({ element, prop, prefix, suffix }) => {
  return {

  }
}

export default function Home() {

  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState(template)
  const _params = useDebounce<any>(params, 300)

  const update = ({
    target: {
      value,
      dataset: {
        element,
        prop,
        value: dataValue,
        prefix = '',
        suffix = '',
      }
    } }: React.ChangeEvent<HTMLInputElement | HTMLElement>) => {

    if (!element || !prop)
      return console.error(element, prop, 'not found')

    setParams({
      ...params,
      [element]: {
        ...params[element],
        [prop]: `${prefix}${value || dataValue}${suffix}`
      }
    })
  }

  useEffect(() => {
    if (!Object.keys(_params).length)
      return

    setLoading(true)
  }, [_params])

  const qs = encodeURIComponent(JSON.stringify(_params))
  const imageUrl = `/api/imgram?params=${qs}`

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img
          alt="image"
          src={imageUrl}
          onLoad={() => setLoading(false)}
        />
        {loading && <div className={s.loading}></div>}
      </div>
      <div className={s.config}>
        <a className={s.download} href={imageUrl} download="Fin bild.png">
          <button>Download</button>
        </a>
        <form>
          <label htmlFor="fontSize">fontSize</label>
          <input
            name="fontSize"
            type="range"
            data-element="text"
            data-prop="fontSize"
            data-suffix="px"
            min="0"
            max="128"
            value={params.text.fontSize.replace('px', '')}
            onChange={update}
          />
          <br />
          <label htmlFor="fontSize">fontColor</label>
          <div className={s.colors}>
            {colors.map((color, idx) =>
              <div
                key={idx}
                className={params.text?.color === color ? s.selected : undefined}
                style={{ backgroundColor: color }}
                data-prop="color"
                data-element="text"
                data-value={color}
                onClick={update}
              ></div>
            )}
          </div>
          <label htmlFor="padding">Padding</label>
          <input
            name="padding"
            min={20}
            max={100}
            type="range"
            data-element="text"
            data-prop="padding"
            data-suffix="px"
            value={params.text.padding.replace('px', '')}
            onChange={update}
          />
          <br />
          <label htmlFor="header">Rubrik</label>
          <input
            name="header"
            type="text"
            data-element="header"
            data-prop="value"
            value={params.header.value}
            onChange={update}
          />
          <br />
          <label htmlFor="text">Text</label>
          <textarea
            data-element="text"
            data-prop="value"
            onChange={update}
            rows={4}
            cols={40}
          >{params.text.value}</textarea>
          <br />
          <label htmlFor="align">Align</label>
          <select
            name="align"
            onChange={update}
            data-element="text"
            data-prop="alignItems"
            value={params.text.alignItems}
          >
            <option value="flex-start">Left</option>
            <option value="center">Center</option>
            <option value="flex-end">Right</option>
          </select>
          <label htmlFor="alignText">Align text</label>
          <select
            name="alignText"
            onChange={update}
            data-element="text"
            data-prop="textAlign"
            value={params.text.textAlign}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <div className={s.images}>
            {images.map((url, idx) =>
              <img
                key={idx}
                className={params.image?.url === url ? s.selected : undefined}
                src={url}
                data-prop="url"
                data-element="image"
                data-value={url}
                onClick={update}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
