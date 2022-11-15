import template from './index.json'

const SaskiaNeuman = (props) => {
  const { container, image, text } = props

  return (
    <div style={{ ...container }}>
      {image.src &&
        <img src={image.src} style={{ ...image }} />
      }
      <div style={{ ...text }}>
        {text?.value}
      </div>
    </div>
  )
}

export default SaskiaNeuman;
