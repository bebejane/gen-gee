import template from './index.json'
import config from './config.json'

const SaskiaNeuman = (props) => {
  const {
    container,
    image,
    text,
    flex,
    italic,
    values: {
      artist,
      titleSwedish,
      titleEnglish,
      date,
      src
    },
  } = props

  return (
    <div style={{ ...container }}>
      {src &&
        <img src={src} style={{ ...image }} />
      }
      <div style={{ ...text }}>
        <div style={{ ...flex }}>{artist}</div>
        <div style={{ ...flex }}>{titleSwedish}</div>
        <div style={{ ...flex, ...italic }}>— {titleEnglish}</div>
        <div style={{ ...flex }}>{date}</div>
      </div>
    </div>
  )
}

SaskiaNeuman.template = template
SaskiaNeuman.config = config

export default SaskiaNeuman;
