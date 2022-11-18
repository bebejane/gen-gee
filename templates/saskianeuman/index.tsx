import config from './config.json'
import styles from './styles.json'

const SaskiaNeuman = (props: any) => {
  const {
    styles: {
      container,
      image,
      text,
      flex,
      italic,
    },
    config: {
      fields: {
        backgroundImage,
        artist,
        titleEnglish,
        titleSwedish,
        startDate,
        endDate
      },
    }
  } = props

  return (
    <div style={{ ...container }}>
      {backgroundImage.value &&
        <img src={backgroundImage.value} style={{ ...image }} />
      }
      <div style={{ ...text }}>
        <div style={{ ...flex }}>
          {artist.value}
        </div>
        <div style={{ ...flex }}>
          {titleSwedish.value}
        </div>
        <div style={{ ...flex, ...italic }}>
          {titleEnglish.value ? `— ${titleEnglish.value}` : ''}
        </div>
        {(startDate.value && endDate.value) &&
          <div style={{ ...flex }}>{startDate.value}—{endDate.value}</div>
        }
      </div>
    </div >
  )
}

SaskiaNeuman.config = config;
SaskiaNeuman.styles = styles;

export default SaskiaNeuman;
