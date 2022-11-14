import template from './index.json'

const SaskiaNeuman = (props) => {
  const { container, image, text } = props

  return (
    <div style={{ ...container }}>
      <img
        src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/image1.jpg`}
        style={{ ...image }}
      />
      <div style={{ ...text }}>
        {text?.value}
      </div>
    </div>
  )
}

SaskiaNeuman.template = template
SaskiaNeuman.config = {
  "dimensions": {
    "width": 800,
    "height": 500
  }
}
export default SaskiaNeuman;
