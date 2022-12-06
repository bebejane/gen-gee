import config from './config.json'
import styles from './styles.json'

const SaskiaNeuman = ({
  styles,
  values: {
    backgroundImage,
    color,
    artist,
    titleEnglish,
    titleSwedish,
    startDate,
    endDate,
    objectFit
  } }) => {

  return (
    <div style={{ ...styles.container }}>
      {backgroundImage &&
        <img src={backgroundImage} style={{ ...styles.image, objectFit }} />
      }
      <div style={{ ...styles.text, color }}>
        <div style={{ ...styles.flex }}>
          {artist}
        </div>
        <div style={{ ...styles.flex, ...styles.italic }}>
          {titleSwedish}
        </div>
        <div style={{ ...styles.flex, ...styles.italic }}>
          {titleEnglish ? `— ${titleEnglish}` : ''}
        </div>
        {(startDate && endDate) &&
          <div style={{ ...styles.flex }}>{startDate}—{endDate}</div>
        }
      </div>
    </div >
  )
}

SaskiaNeuman.config = config;
SaskiaNeuman.styles = styles;

export default SaskiaNeuman;
